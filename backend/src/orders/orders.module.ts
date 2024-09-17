import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditService } from '../services/audit.service';
import { Product } from '../entities/product.entity';

/**
 * `OrdersModule` is a NestJS module responsible for managing orders within the application.
 * It includes imports for entity management, controllers for handling HTTP requests, 
 * and providers for business logic and auditing functionalities.
 */
@Module({
  imports: [
    /**
     * Importing TypeOrmModule with the `Order`, `OrderItem`, `AuditLog`, and `Product` entities
     * to enable database operations related to orders, order items, audit logs, and products.
     * 
     * - `Order`: Entity representing an order.
     * - `OrderItem`: Entity representing the items within an order.
     * - `AuditLog`: Entity used to track changes and activities related to orders.
     * - `Product`: Entity representing product data related to orders.
     */
    TypeOrmModule.forFeature([Order, OrderItem, AuditLog, Product]),
  ],
  controllers: [
    /**
     * `OrdersController`: Handles HTTP requests related to orders. Manages operations such as 
     * creating, retrieving, updating, and deleting orders.
     */
    OrdersController,
  ],
  providers: [
    /**
     * `OrdersService`: Provides business logic for managing orders, including operations such as 
     * creating new orders, updating existing ones, and retrieving order details.
     */
    OrdersService,

    /**
     * `AuditService`: Handles auditing tasks related to orders, tracking changes and activities 
     * associated with order operations.
     */
    AuditService,
  ],
  exports: [
    /**
     * Exporting `OrdersService` to allow other modules to access order-related business logic.
     */
    OrdersService,
  ],
})
export class OrdersModule {}
