// src/users/dto/create-user.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../entities/user.entity';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
  });

  it('should succeed with valid data', async () => {
    const validUser = {
      username: 'john_doe',
      password: 'strongPassword123',
      role: UserRole.USER, // Assuming UserRole is an enum with 'USER' and 'ADMIN'
    };

    const userDto = plainToInstance(CreateUserDto, validUser);
    const errors = await validate(userDto);

    expect(errors.length).toBe(0);
  });

  it('should fail if username is too short', async () => {
    const invalidUser = {
      username: 'ab',
      password: 'strongPassword123',
      role: UserRole.ADMIN,
    };

    const userDto = plainToInstance(CreateUserDto, invalidUser);
    const errors = await validate(userDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
  });

  it('should fail if password is too short', async () => {
    const invalidUser = {
      username: 'john_doe',
      password: '123', // Password is too short
      role: UserRole.ADMIN,
    };

    const userDto = plainToInstance(CreateUserDto, invalidUser);
    const errors = await validate(userDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should succeed if role is not provided (optional)', async () => {
    const validUser = {
      username: 'john_doe',
      password: 'strongPassword123',
    };

    const userDto = plainToInstance(CreateUserDto, validUser);
    const errors = await validate(userDto);

    expect(errors.length).toBe(0);
  });

  it('should fail if username is too long', async () => {
    const invalidUser = {
      username: 'a'.repeat(256), // Exceeds the maximum length
      password: 'strongPassword123',
      role: UserRole.USER,
    };

    const userDto = plainToInstance(CreateUserDto, invalidUser);
    const errors = await validate(userDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
  });
});
