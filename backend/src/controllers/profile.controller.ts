import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AuthenticatedRequest } from '../types/express-request.interface';
import { ChangePasswordDto, ChangeUsernameDto } from '../dtos/change-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('username')
  async changeUsername(@Req() req: AuthenticatedRequest, @Body() changeUsernameDto: ChangeUsernameDto) {
    const userId = req.user.id;
    return this.profileService.changeUsername(userId, changeUsernameDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  async changePassword(@Req() req: AuthenticatedRequest, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.id;

    return this.profileService.changePassword(userId, changePasswordDto);
  }
}
