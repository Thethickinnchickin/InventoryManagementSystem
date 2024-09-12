import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsers: User[] = [
    { id: 1, username: 'admin', password: 'admin', role: UserRole.ADMIN } as User,
    { id: 2, username: 'user', password: 'user', role: UserRole.USER } as User,
  ];

  const mockUser: User = { id: 1, username: 'admin', password: 'admin', role: UserRole.ADMIN } as User;

  const mockCreateUserDto: CreateUserDto = { username: 'newuser', password: 'password', role: UserRole.USER };

  const mockUpdateUserDto: UpdateUserDto = { username: 'updateduser', password: 'NewPassword'};

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue({ ...mockUser, ...mockCreateUserDto }),
    update: jest.fn().mockResolvedValue({ ...mockUser, ...mockUpdateUserDto }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const id = 1;
      const result = await controller.findOne(id);
      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const result = await controller.create(mockCreateUserDto);
      expect(result).toEqual({ ...mockUser, ...mockCreateUserDto });
      expect(usersService.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const id = 1;
      const result = await controller.update(id, mockUpdateUserDto);
      expect(result).toEqual({ ...mockUser, ...mockUpdateUserDto });
      expect(usersService.update).toHaveBeenCalledWith(id, mockUpdateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = 1;
      await controller.remove(id);
      expect(usersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
