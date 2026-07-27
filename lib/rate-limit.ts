type RateLimitRecord = {
  count: number;
  resetTime: number;
};

export class RateLimiter {
  private limitMap: Map<string, RateLimitRecord>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.limitMap = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.limitMap.get(identifier);

    if (!record || now > record.resetTime) {
      const newRecord = { count: 1, resetTime: now + this.windowMs };
      this.limitMap.set(identifier, newRecord);
      this.cleanup();
      return { 
        allowed: true, 
        remaining: this.maxRequests - 1,
        resetTime: newRecord.resetTime 
      };
    }

    if (record.count >= this.maxRequests) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: record.resetTime 
      };
    }

    record.count++;
    return { 
      allowed: true, 
      remaining: this.maxRequests - record.count,
      resetTime: record.resetTime 
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];

    for (const [key, record] of this.limitMap.entries()) {
      if (now > record.resetTime) {
        entriesToDelete.push(key);
      }
    }

    if (entriesToDelete.length > 100) {
      entriesToDelete.forEach(key => this.limitMap.delete(key));
    }
  }

  reset(identifier: string): void {
    this.limitMap.delete(identifier);
  }

  clear(): void {
    this.limitMap.clear();
  }
}

export function getClientIdentifier(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0].trim() || realIp || "unknown";
  return ip;
}

export const emailRateLimiter = new RateLimiter(60 * 1000, 5);
export const checkoutRateLimiter = new RateLimiter(60 * 1000, 10);
export const apiRateLimiter = new RateLimiter(60 * 1000, 100);
