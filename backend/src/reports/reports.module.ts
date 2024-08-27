import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from 'src/services/reports.service';
import { ReportsController } from 'src/controllers/reports.controller';
import { Product } from '../entities/product.entity';
import { Order } from 'src/entities/order.entity';
import { AuditService } from 'src/services/audit.service';
import { AuditLog } from 'src/entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order, AuditLog]),
  ],
  providers: [ReportsService, AuditService],
  controllers: [ReportsController],
})
export class ReportsModule {}
