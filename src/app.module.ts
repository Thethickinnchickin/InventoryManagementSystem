import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './orders/order-items.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { AuditModule } from './audit/audit.module';
import { AuditLog } from './entities/audit-log.entity';

import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Product, Order, OrderItem, User, Category, AuditLog],
      synchronize: true,
    }),
    ProductsModule,
    OrdersModule,
    UsersModule,
    CategoriesModule,
    OrderItemsModule,
    AuditModule,
    ReportsModule,
  ],
})
export class AppModule {}
