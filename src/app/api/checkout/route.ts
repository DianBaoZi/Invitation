import { NextRequest, NextResponse } from "next/server";
import { stripe, INVITE_PRICE_CENTS, PRODUCT_NAME, PRODUCT_DESCRIPTION } from "@/lib/stripe/client";
import { checkRateLimit, getClientIp, rateLimitConfigs } from "@/lib/security/rate-limiter";
import { isValidSlug, sanitizeString } from "@/lib/security/sanitize";
import { getTemplateById } from "@/lib/supabase/templates";

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

    // Validate inviteSlug format
    if (!isValidSlug(inviteSlug)) {
      return NextResponse.json(
        { success: false, error: "Invalid invite" },
        { status: 400 }
      );
    }

    // Validate templateId exists
    if (!getTemplateById(templateId)) {
      return NextResponse.json(
        { success: false, error: "Invalid template" },
        { status: 400 }
      );
    }

    // Sanitize templateName for display
    const safeTemplateName = templateName ? sanitizeString(templateName, 50) : null;

    // Get the base URL for redirects
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://yoursinvite.com";

    // Create Stripe checkout session
    // Note: Not specifying payment_method_types allows Stripe to automatically
    // enable Apple Pay, Google Pay, and other methods based on Dashboard settings
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: safeTemplateName ? `${safeTemplateName} Invite` : PRODUCT_NAME,
              description: PRODUCT_DESCRIPTION,
            },
            unit_amount: INVITE_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?slug=${inviteSlug}`,
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
