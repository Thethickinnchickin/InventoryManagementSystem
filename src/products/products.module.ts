import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from '../services/products.service';
import { ProductsController } from '../controllers/products.controller';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    AuditModule, // Import the AuditModule here
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}