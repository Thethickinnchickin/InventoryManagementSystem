import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from '../controllers/categories.controller';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { AuditModule } from '../audit/audit.module';

/**
 * `CategoriesModule` is a module that manages the categories in the system.
 * 
 * It provides the necessary components to handle category-related operations,
 * including controllers, services, and entities.
 */
@Module({
  imports: [
    /**
     * `TypeOrmModule.forFeature` registers the `Category` entity with TypeORM for 
     * data persistence and querying within this module.
     */
    TypeOrmModule.forFeature([Category]),

    /**
     * Importing `AuditModule` to utilize audit logging functionalities.
     */
    AuditModule,
  ],
  controllers: [
    /**
     * `CategoriesController` handles incoming HTTP requests related to categories,
     * such as creating, updating, retrieving, and deleting categories.
     */
    CategoriesController,
  ],
  providers: [
    /**
     * `CategoriesService` provides business logic related to categories.
     * It interacts with the repository to perform CRUD operations on `Category` entities.
     */
    CategoriesService,
  ],
  exports: [
    /**
     * Exporting `TypeOrmModule.forFeature([Category])` allows other modules to use
     * the `Category` repository for interacting with the `Category` entity.
     */
    TypeOrmModule.forFeature([Category]),
  ],
})
export class CategoriesModule {}
