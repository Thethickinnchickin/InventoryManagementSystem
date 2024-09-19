import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Observable } from 'rxjs';

/**
 * JwtAuthGuard is a custom guard that extends the built-in AuthGuard provided by NestJS Passport.
 * It is used to protect routes by validating JSON Web Tokens (JWTs) and ensuring that only authenticated users
 * can access certain endpoints. The guard checks if the route is public or requires authentication.
 * 
 * Dependencies:
 * - `@nestjs/common`: Provides utilities and decorators for building NestJS applications.
 * - `@nestjs/passport`: Provides Passport-based authentication integration.
 * - `@nestjs/core`: Provides core utilities, including the Reflector class for accessing metadata.
 * 
 * Usage:
 * - This guard should be used to protect routes that require JWT authentication.
 * - The guard will automatically handle JWT extraction and validation based on the strategy configured.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines if the request should be allowed based on JWT authentication.
   * 
   * @param context - The execution context of the request, which includes the request handler and class.
   * @returns A boolean indicating if the request can be activated, a promise that resolves to a boolean, or an observable of a boolean.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve metadata to check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access without authentication
    if (isPublic) {
      return true;
    }

    // Use the base AuthGuard to handle JWT validation and user authentication
    return super.canActivate(context) as Promise<boolean> | boolean;
  }

  /**
   * Handles the request after authentication has been performed.
   * 
   * @param err - Any error encountered during the authentication process.
   * @param user - The authenticated user object.
   * @param info - Additional information from the authentication process.
   * @param context - The execution context of the request.
   * @returns The authenticated user object.
   * @throws UnauthorizedException if authentication fails or no user is provided.
   */
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      console.log(context)
      throw err || new UnauthorizedException();
    }
    
    // Attach the user object to the request for use in route handlers
    const request = context.switchToHttp().getRequest();
    request.user = user;
    
    return user;
  }
}
