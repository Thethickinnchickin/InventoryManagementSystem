import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from 'src/services/reports.service';
import { ReportsController } from 'src/controllers/reports.controller';
import { Product } from '../entities/product.entity';
import { Order } from 'src/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
