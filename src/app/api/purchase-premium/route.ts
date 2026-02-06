import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

// ============================================
// POST /api/purchase-premium - Process premium purchase
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Use service client to bypass RLS for the insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceClient = createServiceClient() as any;

    // Check if user already has premium
    const { data: existingPurchase } = await serviceClient
      .from("purchases")
      .select("id")
      .eq("email", user.email)
      .eq("product_type", "premium")
      .limit(1);

    if (existingPurchase && existingPurchase.length > 0) {
      return NextResponse.json(
        { success: false, error: "You already have premium access" },
        { status: 400 }
      );
    }

    // Create the purchase record
    const { error: insertError } = await serviceClient.from("purchases").insert({
      email: user.email || "",
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      product_type: "premium",
      template_id: null,
      amount_cents: 399,
      stripe_session_id: `premium_${Date.now()}`,
      stripe_payment_id: `premium_pi_${Date.now()}`,
    });

    if (insertError) {
      console.error("Purchase insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to process purchase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Premium purchase error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
