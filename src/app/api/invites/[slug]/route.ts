import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/supabase/templates";
import { getInviteBySlug } from "@/lib/supabase/store";

// ============================================
// GET /api/invites/[slug] - Fetch invite by slug
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    // Validate slug format
    if (!slug || slug.length < 4) {
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

    return NextResponse.json({
      success: true,
      invite: {
        ...invite,
        template,
      },
    });
  } catch (error) {
    console.error("Error fetching invite:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invite" },
      { status: 500 }
    );
  }
}
