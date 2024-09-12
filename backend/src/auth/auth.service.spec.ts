import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity'; // Import your User entity

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByUsername: jest.fn().mockResolvedValue({
        id: 1,
        username: 'adminUser',
        password: await bcrypt.hash('password123', 10), // Simulate hashed password
        role: 'admin',  // Mock the role field
        orders: [],  // Mock the orders field as an empty array
      } as User),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('signed-jwt-token'), // Mock JWT sign
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should validate a user and return user data without password', async () => {
    const user = await authService.validateUser('adminUser', 'password123');

    expect(user).toEqual({ id: 1, username: 'adminUser', role: 'admin', orders: [] });
    expect(usersService.findByUsername).toHaveBeenCalledWith('adminUser');
  });

  it('should return null if password is invalid', async () => {
    jest.spyOn(usersService, 'findByUsername').mockResolvedValueOnce({
      id: 1,
      username: 'adminUser',
      password: await bcrypt.hash('differentPassword', 10), // Different password for testing
      role: 'admin',
      orders: [],
    } as User);

    const user = await authService.validateUser('adminUser', 'wrongPassword');

    expect(user).toBeNull(); // Invalid password should return null
  });

  it('should generate a JWT token for valid user', async () => {
    const user = { id: 1, username: 'adminUser', role: 'admin', orders: [] };
    const result = await authService.login(user);

    expect(result).toEqual({ access_token: 'signed-jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({ username: 'adminUser', sub: 1, role: 'admin' });
  });
});
