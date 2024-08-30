import { Controller, Post, Body, Request, UseGuards, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('protected-route')
  protectedRoute(@Request() req) {
    return req.user;
  }
}
