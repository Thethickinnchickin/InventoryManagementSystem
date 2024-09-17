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
    private readonly userRepository: Repository<User>, // Repository for user entity
    private readonly usersService: UsersService // Service to handle user-related operations
  ) {}

  /**
   * Retrieve the profile of a user by their ID.
   * @param userId - The ID of the user whose profile is to be retrieved.
   * @returns The user entity.
   */
  async getProfile(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  /**
   * Update the profile information of a user.
   * @param userId - The ID of the user whose profile is to be updated.
   * @param updateProfileDto - Data transfer object containing updated profile information.
   * @returns The updated user entity.
   */
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    await this.userRepository.update(userId, updateProfileDto); // Update the user profile
    return this.getProfile(userId); // Retrieve and return the updated profile
  }

  /**
   * Change the password of a user.
   * @param userId - The ID of the user whose password is to be changed.
   * @param changePasswordDto - Data transfer object containing the new password and confirmation.
   * @throws HttpException if passwords do not match.
   */
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { password, confirmPassword } = changePasswordDto;

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST); // Handle password mismatch
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
    await this.usersService.changePassword(userId, hashedPassword); // Update password in user service
  }

  /**
   * Change the username of a user.
   * @param userId - The ID of the user whose username is to be changed.
   * @param changeUsernameDto - Data transfer object containing the new username.
   * @throws HttpException if the username is already taken.
   */
  async changeUsername(userId: number, changeUsernameDto: ChangeUsernameDto): Promise<void> {
    const { username } = changeUsernameDto;

    const existingUser = await this.usersService.findByUsername(username); // Check if username is taken
    if (existingUser && existingUser.id !== userId) {
      throw new HttpException('Username is already taken', HttpStatus.BAD_REQUEST); // Handle username conflict
    }

    await this.usersService.changeUsername(userId, username); // Update username in user service
  }
}
