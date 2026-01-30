import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

// ============================================
// POST /api/webhook - Stripe webhook handler
// ============================================

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get invite slug from metadata
      const inviteSlug = session.metadata?.inviteSlug;

      if (inviteSlug) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const supabase = createServiceClient() as any;

        // Update invite to mark as paid and extend expiration
        const { error } = await supabase
          .from("invites")
          .update({
            is_paid: true,
            stripe_payment_id: session.payment_intent as string,
            // Reset expiration to 30 days from now
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("slug", inviteSlug);

        if (error) {
          console.error("Failed to update invite:", error);
        } else {
          console.log(`Payment successful for invite: ${inviteSlug}`);
        }

        // Record purchase
        await supabase.from("purchases").insert({
          email: session.customer_details?.email || "",
          name: session.customer_details?.name || "",
          product_type: "single",
          template_id: session.metadata?.templateId,
          amount_cents: session.amount_total || 99,
          stripe_session_id: session.id,
          stripe_payment_id: session.payment_intent as string,
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
