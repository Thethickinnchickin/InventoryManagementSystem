import { SetMetadata } from '@nestjs/common';

// The key used to store the metadata value in the decorator.
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * A custom decorator that marks a route handler or controller as public.
 * This decorator sets metadata on the route handler or controller to indicate
 * that it should bypass authentication checks. This is useful for routes that
 * need to be accessible without requiring the user to be authenticated.
 * 
 * Usage:
 * - Apply this decorator to route handlers or controllers to mark them as public.
 * 
 * Example:
 * @Public()
 * @Get('public-endpoint')
 * async publicEndpoint() {
 *   // This endpoint is accessible without authentication
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
