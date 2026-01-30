import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateSlug, getShareUrl } from "@/lib/supabase/utils";
import { getTemplateById, getDefaultConfig } from "@/lib/supabase/templates";
import { CreateInviteInput, TemplateId, Invite } from "@/lib/supabase/types";
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
    const { template_id, configuration, user_id, creator_email, creator_name, recipient_name, is_paid } =
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServiceClient() as any;
    let slug = generateSlug();
    let attempts = 0;

    // Check if slug exists in database
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("invites")
        .select("slug")
        .eq("slug", slug)
        .single();

      if (!existing) break;
      slug = generateSlug();
      attempts++;
    }

    // Sanitize inputs
    const sanitizedConfig = configuration
      ? sanitizeInviteConfig(configuration as unknown as Record<string, unknown>)
      : getDefaultConfig(template_id);

    const sanitizedEmail = creator_email ? sanitizeEmail(creator_email) : null;
    const sanitizedCreatorName = creator_name ? sanitizeString(creator_name, 100) : null;
    const sanitizedRecipientName = recipient_name ? sanitizeString(recipient_name, 100) : null;

    // Insert invite into Supabase
    const { data, error } = await supabase
      .from("invites")
      .insert({
        slug,
        template_id: template_id as TemplateId,
        configuration: sanitizedConfig,
        user_id: user_id || null,
        creator_email: sanitizedEmail,
        creator_name: sanitizedCreatorName,
        recipient_name: sanitizedRecipientName,
        is_paid: is_paid || false,
      })
      .select()
      .single();

    const invite = data as Invite;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create invite" },
        { status: 500 }
      );
    }

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

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServiceClient() as any;
    const { count, error } = await supabase
      .from("invites")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: true, count: 0 },
        { headers: { "Cache-Control": "private, max-age=60" } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: count || 0,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching invite count:", error);
    return NextResponse.json(
      { success: true, count: 0 },
      { headers: { "Cache-Control": "private, max-age=60" } }
    );
  }
}
