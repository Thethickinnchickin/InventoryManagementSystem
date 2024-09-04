import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AuthenticatedRequest } from '../types/express-request.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    console.log(req.user)
    return this.profileService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put('change-password')
  // async changePassword(@Req() req: Request, @Body() changePasswordDto: ChangePasswordDto) {
  //   const userId = req.user.id;
  //   return this.profileService.changePassword(userId, changePasswordDto);
  // }
}
