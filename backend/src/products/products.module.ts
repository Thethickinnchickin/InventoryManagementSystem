import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from '../services/products.service';
import { ProductsController } from '../controllers/products.controller';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { AuditModule } from '../audit/audit.module';

/**
 * `ProductsModule` is a module in the NestJS application responsible for managing products.
 * It imports necessary modules, defines providers, and sets up controllers to handle product-related operations.
 */
@Module({
  imports: [
    /**
     * Importing TypeOrmModule with the `Product` and `Category` entities for database operations.
     * 
     * - `Product`: Entity representing product data.
     * - `Category`: Entity representing category data.
     */
    TypeOrmModule.forFeature([Product, Category]),

    /**
     * Importing `AuditModule` to leverage auditing functionalities for tracking changes.
     */
    AuditModule,
  ],
  providers: [
    /**
     * `ProductsService`: Service containing the business logic for managing products, including creation, retrieval, and updates.
     */
    ProductsService,
  ],
  controllers: [
    /**
     * `ProductsController`: Controller handling HTTP requests related to product management, including product listing, creation, and updates.
     */
    ProductsController,
  ],
})
export class ProductsModule {}
