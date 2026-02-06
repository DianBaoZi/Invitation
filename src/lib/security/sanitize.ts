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
 * Includes size limits to prevent DoS attacks via large data URLs
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== "string") return null;

  const trimmed = url.trim();

  // Block javascript: URLs that might be encoded (check first for security)
  const lowercased = trimmed.toLowerCase();
  if (
    lowercased.includes("javascript:") ||
    lowercased.includes("vbscript:") ||
    lowercased.includes("data:text/html")
  ) {
    return null;
  }

  // Check for data URLs (images only)
  if (trimmed.startsWith("data:image/")) {
    // Limit data URL size to 5MB to prevent DoS
    const MAX_DATA_URL_SIZE = 5 * 1024 * 1024; // 5MB
    if (trimmed.length > MAX_DATA_URL_SIZE) {
      console.warn(`Data URL rejected: size ${trimmed.length} exceeds limit`);
      return null;
    }

    // Validate it's actually an image type
    const validImageTypes = [
      "data:image/jpeg",
      "data:image/jpg",
      "data:image/png",
      "data:image/gif",
      "data:image/webp",
      "data:image/svg+xml",
      "data:image/bmp",
    ];

    const isValidImage = validImageTypes.some((type) =>
      lowercased.startsWith(type)
    );

    if (!isValidImage) {
      return null;
    }

    return trimmed;
  }

  // Only allow http and https for external URLs
  if (trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Upgrade http to https for security
  if (trimmed.startsWith("http://")) {
    return trimmed.replace("http://", "https://");
  }

  return null;
}

/**
 * Validate and sanitize invite configuration
 */
export function sanitizeInviteConfig(config: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  // Keys that contain photo/image data URLs - allow larger sizes
  const photoKeys = ["photoUrl1", "photoUrl2", "photoUrl3", "photo1Url", "photo2Url", "photo3Url"];

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "string") {
      // Check if this is a photo URL field
      if (photoKeys.includes(key)) {
        // For photo URLs, use sanitizeUrl which allows data:image/ URLs
        // Don't truncate - base64 images can be large
        const sanitizedUrl = sanitizeUrl(value);
        sanitized[key] = sanitizedUrl || "";
      } else {
        // Sanitize regular string values with length limit
        sanitized[key] = sanitizeString(value, 5000);
      }
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
 * Validate slug format - alphanumeric and hyphens allowed
 */
export function isValidSlug(slug: string): boolean {
  if (typeof slug !== "string") return false;
  // Allow alphanumeric characters and hyphens, 4-50 characters
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{2,48}[a-zA-Z0-9]$/.test(slug);
}
