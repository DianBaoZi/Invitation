import { NextRequest, NextResponse } from "next/server";
import { generateSlug, getShareUrl } from "@/lib/supabase/utils";
import { getTemplateById, getDefaultConfig } from "@/lib/supabase/templates";
import { Invite, CreateInviteInput, TemplateId } from "@/lib/supabase/types";
import { saveInvite, getInviteBySlug, getInviteCount } from "@/lib/supabase/store";

// ============================================
// POST /api/invites - Create new invite
// ============================================

export async function POST(request: NextRequest) {
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

    // Use provided config or default
    const finalConfig = configuration || getDefaultConfig(template_id);

    // Create invite object
    const invite: Invite = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      slug,
      template_id: template_id as TemplateId,
      configuration: finalConfig!,
      creator_email: creator_email || null,
      creator_name: creator_name || null,
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

export async function GET() {
  // For security, this endpoint could be protected or removed
  // For now, just return count
  return NextResponse.json({
    success: true,
    count: getInviteCount(),
  });
}
