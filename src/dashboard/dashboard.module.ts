import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from '../controllers/dashboard.controller';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { OrderItem } from 'src/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, OrderItem]), // Import the entities
  ],
  controllers: [DashboardController], // Register the controller
  providers: [], // Add providers if needed
  exports: [], // Export any services if needed
})
export class DashboardModule {}
