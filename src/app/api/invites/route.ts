import { NextRequest, NextResponse } from "next/server";
import { generateSlug, getShareUrl } from "@/lib/supabase/utils";
import { getTemplateById, getDefaultConfig } from "@/lib/supabase/templates";
import { Invite, CreateInviteInput, TemplateId } from "@/lib/supabase/types";
import { saveInvite, getInviteBySlug, getInviteCount } from "@/lib/supabase/store";
import { checkRateLimit, getClientIp, rateLimitConfigs } from "@/lib/security/rate-limiter";
import { sanitizeString, sanitizeEmail, sanitizeInviteConfig } from "@/lib/security/sanitize";

// ============================================
// POST /api/invites - Create new invite
// ============================================

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`create:${clientIp}`, rateLimitConfigs.createInvite);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = (await request.json()) as CreateInviteInput;
    const { template_id, configuration, creator_email, creator_name, is_paid } =
      body;

    // Validate template exists
    const template = getTemplateById(template_id);
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug();
    let attempts = 0;
    while (getInviteBySlug(slug) && attempts < 10) {
      slug = generateSlug();
      attempts++;
    }

    // Sanitize inputs
    const sanitizedConfig = configuration
      ? sanitizeInviteConfig(configuration as unknown as Record<string, unknown>)
      : getDefaultConfig(template_id);

    const sanitizedEmail = creator_email ? sanitizeEmail(creator_email) : null;
    const sanitizedName = creator_name ? sanitizeString(creator_name, 100) : null;

    // Create invite object
    const invite: Invite = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      slug,
      template_id: template_id as TemplateId,
      configuration: sanitizedConfig as Invite["configuration"],
      creator_email: sanitizedEmail,
      creator_name: sanitizedName,
      is_paid: is_paid || false,
      stripe_payment_id: null,
      created_at: new Date().toISOString(),
    };

    // Store invite
    saveInvite(invite);

    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        slug: invite.slug,
        shareUrl: getShareUrl(invite.slug),
      },
    });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create invite" },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/invites - List invites (optional)
// ============================================

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`list:${clientIp}`, rateLimitConfigs.readInvite);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  // For security, this endpoint could be protected or removed
  // For now, just return count with cache headers
  return NextResponse.json(
    {
      success: true,
      count: getInviteCount(),
    },
    {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    }
  );
}
