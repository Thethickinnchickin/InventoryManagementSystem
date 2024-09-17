import { Controller, Post, Body, Request, UseGuards, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

/**
 * Controller for handling authentication-related routes.
 * 
 * This controller manages the authentication processes including user login and protected routes.
 * It uses `AuthService` to handle user validation and JWT generation, and guards to secure routes.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handles user login.
   * 
   * @param body - The request body containing the username and password for authentication.
   * @param res - The response object used to send the JWT token or error message.
   * 
   * @throws UnauthorizedException if the credentials are invalid.
   * 
   * @returns A JSON object with the JWT token if authentication is successful.
   * 
   * Example request body:
   * ```json
   * {
   *   "username": "user",
   *   "password": "password123"
   * }
   * ```
   * 
   * Example response:
   * ```json
   * {
   *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJzdWIiOjEsInJvbGUiOiJ1c2VyIn0.Szj0...
   * }
   * ```
   */
  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(body.username, body.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const token = await this.authService.login(user);
      res.json({ token });  // Send the token in the response body
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * A protected route that requires JWT authentication.
   * 
   * This route is secured by the `JwtAuthGuard` and returns the user information from the request.
   * 
   * @param req - The request object containing the user information from the JWT token.
   * 
   * @returns The user information extracted from the JWT token.
   * 
   * Example response:
   * ```json
   * {
   *   "username": "user",
   *   "sub": 1,
   *   "role": "user"
   * }
   * ```
   */
  @UseGuards(JwtAuthGuard)
  @Post('protected-route')
  protectedRoute(@Request() req) {
    return req.user;
  }
}
