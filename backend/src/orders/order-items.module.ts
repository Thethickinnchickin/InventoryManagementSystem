import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsController } from '../controllers/order-items.controller';
import { OrderItemsService } from '../services/order-items.service';
import { OrderItem } from '../entities/order-item.entity';
import { AuditModule } from '../audit/audit.module';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';

/**
 * `OrderItemsModule` is a module in the NestJS application responsible for managing order items.
 * It imports necessary modules, defines providers, and sets up controllers to handle order item-related operations.
 */
@Module({
  imports: [
    /**
     * Importing TypeOrmModule with the `OrderItem`, `Order`, and `Product` entities for database operations.
     * 
     * - `OrderItem`: Entity representing the details of items in an order.
     * - `Order`: Entity representing an order.
     * - `Product`: Entity representing product data.
     */
    TypeOrmModule.forFeature([OrderItem, Order, Product]),

    /**
     * Importing `AuditModule` to enable auditing functionalities for tracking changes related to order items.
     */
    AuditModule,
  ],
  controllers: [
    /**
     * `OrderItemsController`: Controller handling HTTP requests related to order items, including creation, retrieval, and updates.
     */
    OrderItemsController,
  ],
  providers: [
    /**
     * `OrderItemsService`: Service containing the business logic for managing order items, such as adding new items, updating existing ones, and retrieving order item information.
     */
    OrderItemsService,
  ],
  exports: [
    /**
     * Exporting `OrderItemsService` to make it available for other modules that may need to use its functionalities.
     */
    OrderItemsService,
  ],
})
export class OrderItemsModule {}
