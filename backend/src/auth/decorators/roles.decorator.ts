import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity';

// Custom metadata key for role-based access control.
export const ROLES_KEY = 'roles';

/**
 * A custom decorator that sets the required user roles for accessing a route handler or controller.
 * This decorator allows you to specify which user roles are allowed to access the decorated route or controller.
 * 
 * Usage:
 * - Apply this decorator to route handlers or controllers to restrict access based on user roles.
 * 
 * Example:
 * @Roles(UserRole.ADMIN, UserRole.MANAGER)
 * @Get('restricted-endpoint')
 * async restrictedEndpoint() {
 *   // This endpoint is accessible only by users with ADMIN or MANAGER roles
 * }
 * 
 * @Roles(UserRole.USER)
 * @Get('user-endpoint')
 * async userEndpoint() {
 *   // This endpoint is accessible only by users with USER role
 * }
 * 
 * @param roles - An array of roles that are allowed to access the route handler or controller.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
