import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from '../controllers/health.controller';
import { User } from '../entities/user.entity'; // Example entity to test DB connectivity

/**
 * HealthModule sets up the health check endpoints for the application.
 * It imports TypeOrmModule to allow optional database checks in the controller.
 */
@Module({
  imports: [
    /**
     * TypeOrmModule.forFeature([User]) is used here just to give the HealthController
     * access to the database repository if you want to verify DB connection.
     */
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
