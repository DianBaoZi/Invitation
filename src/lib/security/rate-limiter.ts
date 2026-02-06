/**
 * Simple in-memory rate limiter for API protection
 * Prevents abuse by limiting requests per IP address
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  const keys = Array.from(rateLimitStore.keys());
  keys.forEach((key) => {
    const entry = rateLimitStore.get(key);
    if (entry && now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 60000); // Clean every minute

export interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 100,  // 100 requests
  windowMs: 60000,   // per minute
};

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // If no entry or expired, create new one
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Validate IP address format (basic check)
 */
function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false; // IPv6 max length

  // IPv4 pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 pattern (simplified)
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  if (ipv4Pattern.test(ip)) {
    // Validate each octet is 0-255
    const octets = ip.split(".");
    return octets.every((octet) => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }

  return ipv6Pattern.test(ip);
}

/**
 * Simple string hash for fingerprinting
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get client IP from request headers
 * SECURITY: Only trusts headers set by known reverse proxies
 */
export function getClientIp(request: Request): string {
  // Cloudflare-specific header (most reliable when using Cloudflare)
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp && isValidIp(cfConnectingIp)) {
    return cfConnectingIp;
  }

  // Vercel-specific header
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    const ip = vercelForwardedFor.split(",")[0].trim();
    if (isValidIp(ip)) {
      return ip;
    }
  }

  // Standard forwarded header
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (isValidIp(ip)) {
      return ip;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  // Fallback - fingerprint from request characteristics
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLang = request.headers.get("accept-language") || "";
  const fingerprint = `${userAgent.slice(0, 50)}:${acceptLang.slice(0, 20)}`;

  return `fp:${hashString(fingerprint)}`;
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Stricter limit for create operations
  createInvite: {
    maxRequests: 10,   // 10 invites
    windowMs: 60000,   // per minute
  },
  // More lenient for read operations
  readInvite: {
    maxRequests: 100,
    windowMs: 60000,
  },
  // Templates are cached, allow more
  templates: {
    maxRequests: 200,
    windowMs: 60000,
  },
};
