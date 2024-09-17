import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit'; // Importing express-rate-limit for request rate limiting

/**
 * `RateLimitMiddleware` is a NestJS middleware that implements rate limiting to control 
 * the number of requests a client can make to the server within a specified time window.
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limiter;

  /**
   * Constructs an instance of `RateLimitMiddleware` and initializes the rate limiter.
   * The rate limiter is configured to allow up to 100 requests per IP address every 10 minutes.
   */
  constructor() {
    this.limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.', // Message sent when rate limit is exceeded
    });
  }

  /**
   * Middleware function that applies rate limiting to incoming requests.
   * If the rate limiter is not initialized, it returns a 500 error response.
   * 
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function to call
   */
  use(req: any, res: any, next: () => void) {
    if (!this.limiter) {
      console.error('Rate limiter not initialized');
      return res.status(500).send('Rate limiter not initialized');
    }
    this.limiter(req, res, next); // Apply rate limiting to the request
  }
}
