import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './orders/order-items.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuditModule } from './audit/audit.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { ProfileModule } from './profile/profile.module';

/**
 * The `AppModule` is the root module of the NestJS application. It imports and configures various modules,
 * sets up database connections, and applies middleware.
 */
@Module({
  imports: [
    // ConfigModule is used to load environment variables from a `.env` file
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeOrmModule is used to connect to the PostgreSQL database
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL || 'postgresql://postgres:uqYOiTjNGfafaezPxcCROIWsvWSVzfqP@autorack.proxy.rlwy.net:23628/railway',
      autoLoadEntities: true, // Automatically load all entities defined in the application
      synchronize: false, // Set to true in development to auto-create database schema
    }),

    // Importing feature modules
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
  /**
   * Configure middleware for the application.
   * 
   * @param consumer - A MiddlewareConsumer instance used to apply middleware to routes.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware) // Apply rate limiting middleware
      .forRoutes('*'); // Apply to all routes, or specify specific routes if needed
  }
}
