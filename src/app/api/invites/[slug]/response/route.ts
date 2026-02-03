import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// ============================================
// PATCH /api/invites/[slug]/response - Save RSVP response
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { response } = await request.json();
    const { slug } = params;

    if (!response) {
      return NextResponse.json(
        { success: false, error: "Response is required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServiceClient() as any;

    // Update the invite with the response
    const { error } = await supabase
      .from("invites")
      .update({
        response,
        responded_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error saving response:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in response endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
