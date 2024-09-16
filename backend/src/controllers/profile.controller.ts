import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AuthenticatedRequest } from '../types/express-request.interface';
import { ChangePasswordDto, ChangeUsernameDto } from '../dtos/change-profile.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('profile') // Group profile-related endpoints in Swagger
@Controller('profile')
@ApiBearerAuth() // Require JWT authentication for all routes in this controller
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the user profile' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiOperation({ summary: 'Update the profile of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input' })
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('username')
  @ApiOperation({ summary: 'Change the username of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Username changed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input' })
  async changeUsername(@Req() req: AuthenticatedRequest, @Body() changeUsernameDto: ChangeUsernameDto) {
    const userId = req.user.id;
    return this.profileService.changeUsername(userId, changeUsernameDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  @ApiOperation({ summary: 'Change the password of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input' })
  async changePassword(@Req() req: AuthenticatedRequest, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.id;
    return this.profileService.changePassword(userId, changePasswordDto);
  }
}
