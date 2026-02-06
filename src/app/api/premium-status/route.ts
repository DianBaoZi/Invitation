import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Get the authenticated user
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ isPremium: false });
    }

    // Use service client to bypass RLS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceClient = createServiceClient() as any;

    const { data: purchases } = await serviceClient
      .from("purchases")
      .select("id")
      .eq("email", user.email)
      .eq("product_type", "premium")
      .limit(1);

    return NextResponse.json({
      isPremium: purchases && purchases.length > 0
    });
  } catch (error) {
    console.error("Premium status check error:", error);
    return NextResponse.json({ isPremium: false });
  }
}
