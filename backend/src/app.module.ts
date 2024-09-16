import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
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
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL || 'postgresql://postgres:uqYOiTjNGfafaezPxcCROIWsvWSVzfqP@autorack.proxy.rlwy.net:23628/railway',
      autoLoadEntities: true,
      synchronize: false, // Use with caution in production
    }),
    ProductsModule,
    OrdersModule,
    UsersModule,
    CategoriesModule,
    OrderItemsModule,
    AuditModule,
    ReportsModule,
    DashboardModule,
    AuthModule,
    ProfileModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*'); // Apply to all routes, or specify specific routes if needed
  }
}
