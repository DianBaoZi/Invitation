import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { isValidSlug, sanitizeString } from "@/lib/security/sanitize";

// Allowed RSVP response values - whitelist approach
const ALLOWED_RESPONSES = ["Yes", "No", "Maybe", "yes", "no", "maybe"] as const;

// Rate limit config for responses (stricter than general reads)
const responseRateLimitConfig = {
  maxRequests: 5,  // 5 attempts per minute per IP+slug
  windowMs: 60000,
};

// ============================================
// PATCH /api/invites/[slug]/response - Save RSVP response
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // 1. Validate slug format first (prevents injection)
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json(
      { success: false, error: "Invalid invite link" },
      { status: 400 }
    );
  }

  // 2. Rate limiting per IP + slug combination
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    `response:${clientIp}:${slug}`,
    responseRateLimitConfig
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { response } = body;

    // 3. Validate response is provided
    if (!response) {
      return NextResponse.json(
        { success: false, error: "Response is required" },
        { status: 400 }
      );
    }

    // 4. Whitelist validation - only allow specific response values
    const sanitizedResponse = sanitizeString(String(response), 50);
    if (!ALLOWED_RESPONSES.includes(sanitizedResponse as typeof ALLOWED_RESPONSES[number])) {
      return NextResponse.json(
        { success: false, error: "Invalid response value" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServiceClient() as any;

    // 5. Verify invite exists before updating
    const { data: existingInvite, error: fetchError } = await supabase
      .from("invites")
      .select("id, response")
      .eq("slug", slug)
      .single();

    if (fetchError || !existingInvite) {
      return NextResponse.json(
        { success: false, error: "Invite not found" },
        { status: 404 }
      );
    }

    // 6. Update the invite with the validated response
    const { error } = await supabase
      .from("invites")
      .update({
        response: sanitizedResponse,
        responded_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) {
      // Don't leak database error details
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
