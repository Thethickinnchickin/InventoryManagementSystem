import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AuthenticatedRequest } from '../types/express-request.interface';
import { ChangePasswordDto, ChangeUsernameDto } from '../dtos/change-profile.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('profile') // Groups the profile-related API endpoints under the 'profile' section in Swagger UI
@Controller('profile')
@ApiBearerAuth() // Requires JWT authentication for all routes in this controller
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard) // Protects this route with JWT authentication
  @Get()
  @ApiOperation({ summary: 'Get the profile of the authenticated user' }) // Provides a summary of what this endpoint does
  @ApiResponse({ status: 200, description: 'Successfully retrieved the user profile' }) // Response for successful retrieval
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response when access is unauthorized
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id; // Extracts user ID from the authenticated request
    return this.profileService.getProfile(userId); // Calls service to get the profile of the authenticated user
  }

  @UseGuards(JwtAuthGuard) // Protects this route with JWT authentication
  @Put()
  @ApiOperation({ summary: 'Update the profile of the authenticated user' }) // Provides a summary of what this endpoint does
  @ApiResponse({ status: 200, description: 'Profile updated successfully' }) // Response for successful update
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response when access is unauthorized
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input' }) // Response for invalid input
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id; // Extracts user ID from the authenticated request
    return this.profileService.updateProfile(userId, updateProfileDto); // Calls service to update the profile of the authenticated user
  }

  @UseGuards(JwtAuthGuard) // Protects this route with JWT authentication
  @Put('username')
  @ApiOperation({ summary: 'Change the username of the authenticated user' }) // Provides a summary of what this endpoint does
  @ApiResponse({ status: 200, description: 'Username changed successfully' }) // Response for successful username change
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response when access is unauthorized
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input' }) // Response for invalid input
  async changeUsername(@Req() req: AuthenticatedRequest, @Body() changeUsernameDto: ChangeUsernameDto) {
    const userId = req.user.id; // Extracts user ID from the authenticated request
    return this.profileService.changeUsername(userId, changeUsernameDto); // Calls service to change the username of the authenticated user
  }

  @UseGuards(JwtAuthGuard) // Protects this route with JWT authentication
  @Put('password')
  @ApiOperation({ summary: 'Change the password of the authenticated user' }) // Provides a summary of what this endpoint does
  @ApiResponse({ status: 200, description: 'Password changed successfully' }) // Response for successful password change
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response when access is unauthorized
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input' }) // Response for invalid input
  async changePassword(@Req() req: AuthenticatedRequest, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.id; // Extracts user ID from the authenticated request
    return this.profileService.changePassword(userId, changePasswordDto); // Calls service to change the password of the authenticated user
  }
}
