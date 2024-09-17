import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../services/users.service';
import * as bcrypt from 'bcrypt';

/**
 * `AuthService` handles the business logic related to authentication.
 * 
 * It provides methods to validate user credentials and generate JWT tokens for authenticated users.
 */
@Injectable()
export class AuthService {
  constructor(
    /**
     * `UsersService` is injected to interact with user-related data and operations.
     */
    private usersService: UsersService,

    /**
     * `JwtService` is injected to create and manage JWT tokens.
     */
    private jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials by checking the provided username and password.
   * 
   * @param username - The username of the user trying to authenticate.
   * @param pass - The plain-text password provided by the user.
   * @returns A promise that resolves to the user object without the password if validation is successful, otherwise null.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    // Retrieve user data from the user service
    const user = await this.usersService.findByUsername(username);

    // Check if the user exists and if the provided password matches the stored hashed password
    if (user && await bcrypt.compare(pass, user.password)) {
      // Exclude the password from the result
      const { password, ...result } = user;
      return result;
    }
    return null; // Return null if validation fails
  }

  /**
   * Generates a JWT token for the authenticated user.
   * 
   * @param user - The user object containing username, id, and role.
   * @returns An object containing the generated JWT token.
   */
  async login(user: any) {
    // Define the payload to be included in the JWT token
    const payload = { username: user.username, sub: user.id, role: user.role };

    // Generate the JWT token using the payload
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
