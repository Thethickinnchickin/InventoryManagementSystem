import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto, ChangeUsernameDto } from '../dtos/change-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService
  ) {}

  async getProfile(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    await this.userRepository.update(userId, updateProfileDto);
    return this.getProfile(userId);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { password, confirmPassword } = changePasswordDto;

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.changePassword(userId,  hashedPassword);
  }

  async changeUsername(userId: number, changeUsernameDto: ChangeUsernameDto): Promise<void> {
    const { username } = changeUsernameDto;

    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser && existingUser.id !== userId) {
      throw new HttpException('Username is already taken', HttpStatus.BAD_REQUEST);
    }

    await this.usersService.changeUsername(userId, username );
  }
}
