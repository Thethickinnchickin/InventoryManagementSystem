import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limiter;

  constructor() {
    this.limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });
  }

  use(req: any, res: any, next: () => void) {
    this.limiter(req, res, next);
  }
}
