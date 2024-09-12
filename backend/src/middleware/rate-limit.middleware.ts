import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit'; // Ensure correct import

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limiter;

  constructor() {
    this.limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });
  }

  use(req: any, res: any, next: () => void) {
    if (!this.limiter) {
      console.error('Rate limiter not initialized');
      return res.status(500).send('Rate limiter not initialized');
    }
    this.limiter(req, res, next);
  }
}
