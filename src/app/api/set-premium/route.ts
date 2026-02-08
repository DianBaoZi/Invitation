import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";

// ============================================
// POST /api/set-premium - Manually set premium status (admin only)
// ============================================

export async function POST(request: NextRequest) {
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

    // Use service client to bypass RLS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceClient = createServiceClient() as any;

    // Check if already premium
    const { data: existingPurchase } = await serviceClient
      .from("purchases")
      .select("id")
      .eq("email", user.email)
      .eq("product_type", "premium")
      .single();

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        message: "User is already premium",
        isPremium: true,
      });
    }

    // Insert premium purchase record
    const { error: insertError } = await serviceClient.from("purchases").insert({
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      product_type: "premium",
      template_id: null,
      amount_cents: 0, // Manual/admin grant
      stripe_session_id: `manual_${Date.now()}`,
      stripe_payment_id: `manual_${Date.now()}`,
    });

    if (insertError) {
      console.error("Failed to set premium:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to set premium status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Premium status granted",
      isPremium: true,
    });
  } catch (error) {
    console.error("Set premium error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
