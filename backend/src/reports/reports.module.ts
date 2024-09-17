import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from '../services/reports.service';
import { ReportsController } from '../controllers/reports.controller';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { AuditService } from '../services/audit.service';
import { AuditLog } from '../entities/audit-log.entity';

/**
 * `ReportsModule` is a module in the NestJS application responsible for handling reporting-related functionality.
 * It imports necessary modules, defines providers, and sets up controllers to manage reporting operations.
 */
@Module({
  imports: [
    /**
     * Importing TypeOrmModule with entities for database operations.
     * 
     * - `Product`: Entity representing products.
     * - `Order`: Entity representing orders.
     * - `AuditLog`: Entity for logging audit trails.
     */
    TypeOrmModule.forFeature([Product, Order, AuditLog]),
  ],
  providers: [
    /**
     * `ReportsService`: Service providing business logic for reports.
     * `AuditService`: Service for managing audit logs.
     */
    ReportsService,
    AuditService,
  ],
  controllers: [
    /**
     * `ReportsController`: Controller handling incoming requests related to reports.
     */
    ReportsController,
  ],
})
export class ReportsModule {}
