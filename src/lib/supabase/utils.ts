// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate a random slug for invite URLs
 * Format: 8 characters, alphanumeric, URL-safe
 */
export function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

/**
 * Build the full share URL for an invite
 */
export function getShareUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/i/${slug}`;
}

/**
 * Get the app name for branding
 */
export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || "InteractiveInvite";
}
