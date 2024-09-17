/**
 * Interface for JWT (JSON Web Token) payload.
 * 
 * This interface defines the structure of the payload contained within a JWT. It includes
 * essential information about the user that is encoded in the token and used for authentication
 * and authorization purposes within the application.
 * 
 * Properties:
 * - `username` (string): The username of the user. This property represents the user's unique identifier.
 * - `sub` (number): The subject identifier of the user. It typically represents the user's ID in the system.
 * - `role` (string): The role assigned to the user. This property defines the user's role and can be used to
 *   enforce role-based access control (RBAC) within the application.
 * 
 * Example:
 * 
 * ```typescript
 * const jwtPayload: JwtPayload = {
 *   username: 'john_doe',
 *   sub: 12345,
 *   role: 'admin'
 * };
 * ```
 */
export interface JwtPayload {
  username: string;
  sub: number;
  role: string;
}
