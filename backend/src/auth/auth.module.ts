import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

/**
 * The `AuthModule` is responsible for handling authentication within the application.
 * 
 * It integrates JWT authentication and Passport strategies to provide secure access to the API.
 * The module includes all necessary components for user authentication such as services, controllers, and strategies.
 */
@Module({
  imports: [
    /**
     * PassportModule is imported to enable Passport strategies for authentication.
     */
    PassportModule,

    /**
     * JwtModule is imported and configured with a secret key and token expiration settings.
     * 
     * @param secret - The secret key used to sign and verify JWT tokens. In production, this should be a strong and secure key.
     * @param signOptions - Configuration options for signing tokens, such as expiration time.
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // Use a strong secret in production
      signOptions: { expiresIn: '6h' }, // Tokens expire in 6 hours
    }),

    /**
     * UsersModule is imported to provide user-related functionality, such as user management and retrieval.
     */
    UsersModule,
  ],
  /**
   * Controllers handle incoming requests and send responses.
   */
  controllers: [AuthController],

  /**
   * Providers are services that can be injected into other components or services.
   * 
   * - AuthService: Handles authentication logic and JWT token management.
   * - JwtStrategy: Defines the strategy for validating JWT tokens.
   */
  providers: [AuthService, JwtStrategy],

  /**
   * Exports AuthService so that it can be used in other modules.
   */
  exports: [AuthService],
})
export class AuthModule {}
