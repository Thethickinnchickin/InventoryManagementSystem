import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { ChangePasswordDto, ChangeUsernameDto } from '../dtos/change-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/express-request.interface';
import { User, UserRole } from '../entities/user.entity';
import { mock } from 'jest-mock-extended';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: UserRole.USER,
    orders: [],
  };

  const mockUpdateProfileDto: UpdateProfileDto = {
    username: 'updateduser',
    email: 'updatedemail@example.com',
  };

  const mockChangePasswordDto: ChangePasswordDto = {
    password: 'newpassword',
    confirmPassword: 'newpassword',
  };

  const mockChangeUsernameDto: ChangeUsernameDto = {
    username: 'newusername',
  };

  const mockProfileService = {
    getProfile: jest.fn().mockResolvedValue(mockUser),
    updateProfile: jest.fn().mockResolvedValue(mockUser),
    changeUsername: jest.fn().mockResolvedValue(mockUser),
    changePassword: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockRequest: AuthenticatedRequest = {
        user: { id: 1 } as User,
      } as unknown as AuthenticatedRequest;

      const result = await controller.getProfile(mockRequest);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update and return user profile', async () => {
      const mockRequest: AuthenticatedRequest = {
        user: { id: 1 } as User,
      } as unknown as AuthenticatedRequest;

      const result = await controller.updateProfile(mockRequest, mockUpdateProfileDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('changeUsername', () => {
    it('should change username and return updated user profile', async () => {
      const mockRequest: AuthenticatedRequest = {
        user: { id: 1 } as User,
      } as unknown as AuthenticatedRequest;

      const result = await controller.changeUsername(mockRequest, mockChangeUsernameDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change password and return success status', async () => {
      const mockRequest: AuthenticatedRequest = {
        user: { id: 1 } as User,
      } as unknown as AuthenticatedRequest;

      const result = await controller.changePassword(mockRequest, mockChangePasswordDto);
      expect(result).toEqual({ success: true });
    });
  });
});
