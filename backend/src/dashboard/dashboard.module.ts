import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from '../controllers/dashboard.controller';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';

/**
 * `DashboardModule` is a NestJS module responsible for managing the dashboard-related 
 * functionality within the application.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, OrderItem]), // Import entities for data access
  ],
  controllers: [DashboardController], // Register the controller responsible for handling dashboard routes
  providers: [], // Add providers (services, repositories) if needed
  exports: [], // Export any services or modules if needed
})
export class DashboardModule {}
