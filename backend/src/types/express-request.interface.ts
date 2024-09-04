// src/types/express-request.interface.ts

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    // add any other properties from the JWT payload here
  };
}
