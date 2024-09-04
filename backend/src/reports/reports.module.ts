import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from '../services/reports.service';
import { ReportsController } from '../controllers/reports.controller';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { AuditService } from '../services/audit.service';
import { AuditLog } from '../entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order, AuditLog]),
  ],
  providers: [ReportsService, AuditService],
  controllers: [ReportsController],
})
export class ReportsModule {}
