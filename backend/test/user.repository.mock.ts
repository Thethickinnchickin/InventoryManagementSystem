import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';

export const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  // Include any other methods you might use in your service
} as unknown as Repository<User>;
