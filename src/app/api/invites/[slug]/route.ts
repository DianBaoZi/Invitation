import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { getTemplateById } from "@/lib/supabase/templates";
import { checkRateLimit, getClientIp, rateLimitConfigs } from "@/lib/security/rate-limiter";
import { isValidSlug } from "@/lib/security/sanitize";
import type { Invite } from "@/lib/supabase/types";

// ============================================
// GET /api/invites/[slug] - Fetch invite by slug
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`read:${clientIp}`, rateLimitConfigs.readInvite);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  const { slug } = params;

  try {
    // Validate slug format with stricter check
    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, error: "Invalid invite slug" },
        { status: 400 }
      );
    }

    // Fetch invite from Supabase
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invites")
      .select("*")
      .eq("slug", slug)
      .single();

    const invite = data as Invite | null;

    if (error || !invite) {
      return NextResponse.json(
        { success: false, error: "Invite not found" },
        { status: 404 }
      );
    }

    // Check if invite has expired
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: "This invite has expired" },
        { status: 410 }
      );
    }

    // Record the view (non-blocking)
    supabase
      .from("invite_views")
      .insert({
        invite_id: invite.id,
        ip_address: clientIp,
      })
      .then(() => {})
      .catch((err) => console.error("Failed to record view:", err));

    // Get template info
    const template = getTemplateById(invite.template_id);

    return NextResponse.json(
      {
        success: true,
        invite: {
          ...invite,
          template,
        },
      },
      {
        headers: {
          // Cache for 5 minutes, allow stale for 1 hour while revalidating
          "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching invite:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invite" },
      { status: 500 }
    );
  }
}
