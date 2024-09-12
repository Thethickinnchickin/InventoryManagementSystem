import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { ChangePasswordDto, ChangeUsernameDto } from '../dtos/change-profile.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('ProfileService', () => {
  let profileService: ProfileService;
  let userRepository: Repository<User>;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      changePassword: jest.fn(),
      changeUsername: jest.fn(),
      findByUsername: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });

  describe('getProfile', () => {
    it('should return a user profile by userId', async () => {
      const userId = 1;
      const mockUser: User = { id: userId, username: 'testUser', password: 'hashedPassword' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await profileService.getProfile(userId);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile and return the updated profile', async () => {
      const userId = 1;
      const updateProfileDto: UpdateProfileDto = { username: 'updatedUser' };
      const mockUser: User = { id: userId, username: 'updatedUser', password: 'hashedPassword' } as User;

      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(profileService, 'getProfile').mockResolvedValue(mockUser);

      const result = await profileService.updateProfile(userId, updateProfileDto);
      expect(result).toEqual(mockUser);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateProfileDto);
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
      const userId = 1;
      const changePasswordDto: ChangePasswordDto = { password: 'newPassword123', confirmPassword: 'newPassword123' };
      const hashedPassword = '$2b$10$W3tjTkGvB8e/Siy3hY1rV.OYEkGKRSfY.Cm31ocgoNCFP.If3xyfy'; // Mocked hash

      // Mock bcrypt.hash to return a consistent value
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      jest.spyOn(usersService, 'changePassword').mockResolvedValue(undefined);

      await profileService.changePassword(userId, changePasswordDto);
      expect(usersService.changePassword).toHaveBeenCalledWith(userId, hashedPassword);
    });

    it('should throw an exception if passwords do not match', async () => {
      const userId = 1;
      const changePasswordDto: ChangePasswordDto = { password: 'newPassword123', confirmPassword: 'differentPassword' };

      await expect(profileService.changePassword(userId, changePasswordDto))
        .rejects
        .toThrow(new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST));
    });
  });

  describe('changeUsername', () => {
    it('should change the username if the new username is available', async () => {
      const userId = 1;
      const changeUsernameDto: ChangeUsernameDto = { username: 'newUsername' };
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(usersService, 'changeUsername').mockResolvedValue(undefined);

      await profileService.changeUsername(userId, changeUsernameDto);
      expect(usersService.changeUsername).toHaveBeenCalledWith(userId, changeUsernameDto.username);
    });

    it('should throw an exception if the new username is already taken', async () => {
      const userId = 1;
      const changeUsernameDto: ChangeUsernameDto = { username: 'takenUsername' };
      const existingUser: User = { id: 2, username: 'takenUsername' } as User;

      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(existingUser);

      await expect(profileService.changeUsername(userId, changeUsernameDto))
        .rejects
        .toThrow(new HttpException('Username is already taken', HttpStatus.BAD_REQUEST));
    });
  });
});
