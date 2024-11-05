interface RateLimiterOptions {
  points: number; // Number of requests allowed
  duration: number; // Time window in seconds
  blockDuration: number; // Duration to block if limit exceeded (seconds)
}

interface RateLimitInfo {
  points: number;
  resetAt: number;
  blockedUntil?: number;
}

export class RateLimiter {
  private storage: Map<string, RateLimitInfo> = new Map();
  private readonly points: number;
  private readonly duration: number;
  private readonly blockDuration: number;

  constructor(options: RateLimiterOptions) {
    this.points = options.points;
    this.duration = options.duration;
    this.blockDuration = options.blockDuration;
  }

  consume(key: string): {success: boolean; message?: string} {
    const now = Math.floor(Date.now() / 1000);
    const rateLimitInfo = this.storage.get(key);

    // Check if client is blocked
    if (rateLimitInfo?.blockedUntil && rateLimitInfo.blockedUntil > now) {
      return {
        success: false,
        message: `Too many requests. Please try again in ${
          rateLimitInfo.blockedUntil - now
        } seconds`,
      };
    }

    // If no existing record or expired, create new
    if (!rateLimitInfo || rateLimitInfo.resetAt <= now) {
      this.storage.set(key, {
        points: this.points - 1,
        resetAt: now + this.duration,
      });
      return {success: true};
    }

    // If points available, consume one
    if (rateLimitInfo.points > 0) {
      rateLimitInfo.points -= 1;
      return {success: true};
    }

    // If no points left, block the client
    rateLimitInfo.blockedUntil = now + this.blockDuration;
    return {
      success: false,
      message: `Too many requests. Please try again in ${this.blockDuration} seconds`,
    };
  }

  // Clean up expired entries periodically
  cleanup() {
    const now = Math.floor(Date.now() / 1000);
    for (const [key, info] of this.storage.entries()) {
      if (
        info.resetAt <= now &&
        (!info.blockedUntil || info.blockedUntil <= now)
      ) {
        this.storage.delete(key);
      }
    }
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter({
  points: Number(process.env.RATE_LIMIT_POINTS) || 10,
  duration: Number(process.env.RATE_LIMIT_DURATION) || 1,
  blockDuration: Number(process.env.RATE_LIMIT_BLOCK_DURATION) || 60,
});

// Clean up expired entries every minute
setInterval(() => rateLimiter.cleanup(), 60 * 1000);

export default rateLimiter;
