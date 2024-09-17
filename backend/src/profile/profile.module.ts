import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';
import { User } from '../entities/user.entity';
import { UsersModule } from '../users/users.module';

/**
 * `ProfileModule` is a module in the NestJS application responsible for managing user profiles.
 * It imports necessary modules, defines providers, and sets up controllers to handle profile-related operations.
 */
@Module({
  imports: [
    /**
     * Importing TypeOrmModule with the `User` entity for database operations.
     * 
     * - `User`: Entity representing user data.
     */
    TypeOrmModule.forFeature([User]),

    /**
     * Importing `UsersModule` to leverage user-related functionalities.
     */
    UsersModule,
  ],
  controllers: [
    /**
     * `ProfileController`: Controller handling HTTP requests related to user profile management.
     */
    ProfileController,
  ],
  providers: [
    /**
     * `ProfileService`: Service containing the business logic for managing user profiles.
     */
    ProfileService,
  ],
})
export class ProfileModule {}
