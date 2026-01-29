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
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return "unknown";
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
