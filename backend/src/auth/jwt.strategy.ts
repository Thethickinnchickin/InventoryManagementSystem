import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../services/users.service';

/**
 * `JwtStrategy` implements Passport's JWT strategy to handle JWT authentication.
 * 
 * It extracts and validates JWT tokens from the request to ensure that the user is authenticated.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    /**
     * `UsersService` is injected to retrieve user data based on JWT payload.
     */
    private usersService: UsersService,

    /**
     * `ConfigService` is injected to access configuration variables.
     */
    private configService: ConfigService,
  ) {
    super({
      /**
       * Extracts the JWT token from the `Authorization` header using the Bearer scheme.
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      /**
       * Secret key used to verify the JWT token. It should be set in environment variables for production.
       */
      secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
    });
  }

  /**
   * Validates the JWT payload by checking the user's existence.
   * 
   * @param payload - The decoded JWT payload, which includes user information such as username, ID, and role.
   * @returns The user object if validation is successful, otherwise throws an `UnauthorizedException`.
   */
  async validate(payload: JwtPayload) {
    // Retrieve the user based on the payload's username
    const user = await this.usersService.findByUsername(payload.username);

    // Throw an exception if the user does not exist
    if (!user) {
      throw new UnauthorizedException();
    }

    // Return the user object to be attached to the request
    return user;
  }
}
