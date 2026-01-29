import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/supabase/templates";
import { getInviteBySlug } from "@/lib/supabase/store";
import { checkRateLimit, getClientIp, rateLimitConfigs } from "@/lib/security/rate-limiter";
import { isValidSlug } from "@/lib/security/sanitize";

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

    // Fetch invite from store
    const invite = getInviteBySlug(slug);

    if (!invite) {
      return NextResponse.json(
        { success: false, error: "Invite not found" },
        { status: 404 }
      );
    }

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
