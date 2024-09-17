// src/types/express-request.interface.ts

import { Request } from 'express';

/**
 * `AuthenticatedRequest` extends the default `Request` interface from Express.
 * It adds a `user` property to include user details typically extracted from a JWT.
 */
export interface AuthenticatedRequest extends Request {
  /**
   * `user` contains details of the authenticated user.
   * It is populated with information extracted from the JWT payload.
   */
  user: {
    id: number;           // Unique identifier for the user
    username: string;    // Username of the user
    email: string;       // Email address of the user
    role: string;        // Role of the user (e.g., 'admin', 'user')
  };
}
