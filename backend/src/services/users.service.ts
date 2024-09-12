import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt'; // Import bcrypt here

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async changePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.usersRepository.update(userId, { password: hashedPassword });
  }
  

  async changeUsername(id: number, newUsername: string): Promise<User> {
    const existingUser = await this.findByUsername(newUsername);
    if (existingUser && existingUser.id !== id) {
      throw new Error('Username is already taken');
    }
  
    await this.usersRepository.update(id, { username: newUsername });
    return this.findOne(id);
  }
  
  
}
