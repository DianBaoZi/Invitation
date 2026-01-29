import { NextRequest, NextResponse } from "next/server";
import { TEMPLATES } from "@/lib/supabase/templates";
import { checkRateLimit, getClientIp, rateLimitConfigs } from "@/lib/security/rate-limiter";

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`templates:${clientIp}`, rateLimitConfigs.templates);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      templates: TEMPLATES,
    },
    {
      headers: {
        // Templates are static, cache for 1 hour
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
