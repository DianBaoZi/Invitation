/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * HTML entities to escape
 */
const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Remove potentially dangerous HTML tags and scripts
 */
export function stripHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

/**
 * Sanitize a string for safe display (escape HTML)
 */
export function sanitizeString(str: string, maxLength?: number): string {
  if (typeof str !== "string") return "";

  let sanitized = stripHtml(str.trim());

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize email format
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== "string") return null;

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed) || trimmed.length > 254) {
    return null;
  }

  return trimmed;
}

/**
 * Sanitize URL - only allow safe protocols
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== "string") return null;

  const trimmed = url.trim();

  // Only allow http, https, and data URLs for images
  if (
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("data:image/")
  ) {
    return null;
  }

  // Block javascript: URLs that might be encoded
  if (trimmed.toLowerCase().includes("javascript:")) {
    return null;
  }

  return trimmed;
}

/**
 * Validate and sanitize invite configuration
 */
export function sanitizeInviteConfig(config: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "string") {
      // Sanitize string values
      sanitized[key] = sanitizeString(value, 5000);
    } else if (typeof value === "number") {
      // Keep numbers as-is
      sanitized[key] = value;
    } else if (typeof value === "boolean") {
      // Keep booleans as-is
      sanitized[key] = value;
    } else if (value === null) {
      sanitized[key] = null;
    } else if (Array.isArray(value)) {
      // Recursively sanitize array items
      sanitized[key] = value.map((item) => {
        if (typeof item === "string") return sanitizeString(item, 5000);
        if (typeof item === "object" && item !== null) {
          return sanitizeInviteConfig(item as Record<string, unknown>);
        }
        return item;
      });
    } else if (typeof value === "object") {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeInviteConfig(value as Record<string, unknown>);
    }
  }

  return sanitized;
}

/**
 * Validate slug format - alphanumeric only
 */
export function isValidSlug(slug: string): boolean {
  if (typeof slug !== "string") return false;
  return /^[a-zA-Z0-9]{4,32}$/.test(slug);
}
