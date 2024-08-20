import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsController } from '../controllers/order-items.controller';
import { OrderItemsService } from '../services/order-items.service';
import { OrderItem } from '../entities/order-item.entity';
import { AuditModule } from 'src/audit/audit.module';
import { Product } from 'src/entities/product.entity';
import { Order } from 'src/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Product]), AuditModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService], // Provide the AuditService
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
