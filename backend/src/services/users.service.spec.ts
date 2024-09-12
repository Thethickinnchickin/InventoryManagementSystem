import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user and hash the password', async () => {
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Mock the methods
    jest.spyOn(userRepository, 'create').mockReturnValue({
      username: 'newUser',
      password: hashedPassword,
      role: UserRole.USER,
      orders: [],
    } as User);

    jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 1,
      username: 'newUser',
      password: hashedPassword,
      role: UserRole.USER,
      orders: [],
    } as User);

    // Call the create method
    const user = await service.create({
      username: 'newUser',
      password: plainPassword,
      role: UserRole.USER,
    });

    // Assertions
    expect(user).toBeDefined();
    expect(await bcrypt.compare(plainPassword, user.password)).toBe(true);
  });
});
