import { NextRequest, NextResponse } from "next/server";
import { stripe, INVITE_PRICE_CENTS, PRODUCT_NAME, PRODUCT_DESCRIPTION } from "@/lib/stripe/client";
import { checkRateLimit, getClientIp, rateLimitConfigs } from "@/lib/security/rate-limiter";

// ============================================
// POST /api/checkout - Create Stripe checkout session
// ============================================

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`checkout:${clientIp}`, rateLimitConfigs.createInvite);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { inviteSlug, templateId, templateName } = body;

    if (!inviteSlug || !templateId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the base URL for redirects
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: templateName ? `${templateName} Invite` : PRODUCT_NAME,
              description: PRODUCT_DESCRIPTION,
            },
            unit_amount: INVITE_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&slug=${inviteSlug}`,
      cancel_url: `${origin}/payment/cancel?slug=${inviteSlug}`,
      metadata: {
        inviteSlug,
        templateId,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
