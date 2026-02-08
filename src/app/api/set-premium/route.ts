import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// ============================================
// POST /api/set-premium - Admin-only endpoint to grant premium
// Requires ADMIN_SECRET_KEY in request body for security
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, adminKey } = body;

    // Verify admin secret key
    if (!process.env.ADMIN_SECRET_KEY || adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceClient = createServiceClient() as any;

    // Check if already premium
    const { data: existingPurchase } = await serviceClient
      .from("purchases")
      .select("id")
      .eq("email", email)
      .eq("product_type", "premium")
      .single();

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        message: "User is already premium",
      });
    }

    // Insert premium purchase record
    const { error: insertError } = await serviceClient.from("purchases").insert({
      email,
      name: email.split("@")[0] || "User",
      product_type: "premium",
      template_id: null,
      amount_cents: 0,
      stripe_session_id: `admin_grant_${Date.now()}`,
      stripe_payment_id: `admin_grant_${Date.now()}`,
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
      message: `Premium granted to ${email}`,
    });
  } catch (error) {
    console.error("Set premium error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
