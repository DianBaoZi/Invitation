import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Get the authenticated user
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ invites: [], error: "Not authenticated" }, { status: 401 });
    }

    // Use service client to bypass RLS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceClient = createServiceClient() as any;

    const { data: invites, error } = await serviceClient
      .from("invites")
      .select(`
        id,
        slug,
        template_id,
        creator_name,
        recipient_name,
        is_paid,
        created_at,
        expires_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading invites:", error);
      return NextResponse.json({ invites: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invites: invites || [] });
  } catch (error) {
    console.error("My invites error:", error);
    return NextResponse.json({ invites: [], error: "Internal server error" }, { status: 500 });
  }
}
