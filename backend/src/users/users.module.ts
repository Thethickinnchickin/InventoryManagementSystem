import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

/**
 * The `UsersModule` is a feature module responsible for managing user-related operations in the application.
 * It handles user entity interactions, provides user services, and sets up user-related endpoints.
 */
@Module({
  imports: [
    // TypeOrmModule is used to connect to the User entity repository
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    // UsersController handles HTTP requests related to users
    UsersController,
  ],
  providers: [
    // UsersService contains business logic related to user operations
    UsersService,
  ],
  exports: [
    // Exporting UsersService to make it available in other modules
    UsersService,
  ],
})
export class UsersModule {}
