import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Inject the User repository
  ) {}

  /**
   * Retrieve all users from the repository.
   * @returns A promise that resolves to an array of users.
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Retrieve a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the user.
   */
  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Retrieve a user by their username.
   * @param username - The username of the user to retrieve.
   * @returns A promise that resolves to the user.
   */
  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  /**
   * Create a new user with a hashed password.
   * @param createUserDto - Data transfer object containing user details.
   * @returns A promise that resolves to the created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  /**
   * Update an existing user, optionally hashing the new password if provided.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data transfer object containing update details.
   * @returns A promise that resolves to the updated user.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  /**
   * Remove a user by their ID.
   * @param id - The ID of the user to remove.
   */
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  /**
   * Change the password for a user, using a hashed password.
   * @param userId - The ID of the user whose password is to be changed.
   * @param hashedPassword - The new hashed password.
   */
  async changePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.usersRepository.update(userId, { password: hashedPassword });
  }

  /**
   * Change the username of a user, ensuring the new username is unique.
   * @param id - The ID of the user whose username is to be changed.
   * @param newUsername - The new username.
   * @returns A promise that resolves to the updated user.
   * @throws Error if the new username is already taken.
   */
  async changeUsername(id: number, newUsername: string): Promise<User> {
    const existingUser = await this.findByUsername(newUsername);
    if (existingUser && existingUser.id !== id) {
      throw new Error('Username is already taken');
    }

    await this.usersRepository.update(id, { username: newUsername });
    return this.findOne(id);
  }
}
