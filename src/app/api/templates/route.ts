import { NextResponse } from "next/server";
import { TEMPLATES } from "@/lib/supabase/templates";

export async function GET() {
  return NextResponse.json({
    success: true,
    templates: TEMPLATES,
  });
}
