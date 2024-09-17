import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../entities/user.entity';

/**
 * RolesGuard is a custom guard used to protect routes based on user roles.
 * It checks if the authenticated user has the required roles to access a particular route.
 * 
 * Dependencies:
 * - `@nestjs/common`: Provides utilities and decorators for building NestJS applications.
 * - `@nestjs/core`: Provides core utilities, including the Reflector class for accessing metadata.
 * 
 * Usage:
 * - This guard should be used to restrict access to routes based on user roles.
 * - Role-based access control can be implemented by setting roles metadata on route handlers using the `Roles` decorator.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the request can be activated based on the user's roles.
   * 
   * @param context - The execution context of the request, which includes the request handler and class.
   * @returns A boolean indicating if the request can be activated based on role authorization.
   * @throws ForbiddenException if the user does not have the required roles to access the route.
   */
  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles metadata set on the route handler
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    
    // If no roles are specified for the route, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the request object and the authenticated user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user exists and has one of the required roles
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    // If the user has the required role, allow access
    return true;
  }
}
