import { NextRequest, NextResponse } from "next/server";
import { stripe, LIFETIME_PRICE_CENTS, LIFETIME_PRODUCT_NAME, LIFETIME_PRODUCT_DESCRIPTION } from "@/lib/stripe/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, rateLimitConfigs } from "@/lib/security/rate-limiter";

// ============================================
// POST /api/checkout-premium - Create Stripe checkout for premium
// ============================================

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`checkout-premium:${clientIp}`, rateLimitConfigs.createInvite);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    // Get the authenticated user
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the base URL for redirects
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://yoursinvite.com";

    // Create Stripe checkout session for premium
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: LIFETIME_PRODUCT_NAME,
              description: LIFETIME_PRODUCT_DESCRIPTION,
            },
            unit_amount: LIFETIME_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?premium=true`,
      cancel_url: `${origin}/?cancelled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        userEmail: user.email || "",
        productType: "premium",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe premium checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
