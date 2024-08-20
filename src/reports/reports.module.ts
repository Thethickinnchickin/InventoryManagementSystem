import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from 'src/services/reports.service';
import { ReportsController } from 'src/controllers/reports.controller';
import { Product } from '../entities/product.entity'; // Import Product entity
import { Order } from 'src/entities/order.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Product, Order]), // Register the Product entity
    ],
    providers: [ReportsService],
    controllers: [ReportsController],
  })
  export class ReportsModule {}