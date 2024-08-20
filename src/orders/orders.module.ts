import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { AuditLog } from '../entities/audit-log.entity'; // Import AuditLog entity
import { AuditService } from '../services/audit.service'; // Import AuditService

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, AuditLog])], // Include AuditLog in TypeOrmModule
  controllers: [OrdersController],
  providers: [OrdersService, AuditService], // Provide AuditService
  exports: [OrdersService],
})
export class OrdersModule {}
