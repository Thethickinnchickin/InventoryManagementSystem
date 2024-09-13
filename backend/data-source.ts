// data-source.ts
import { DataSource } from 'typeorm';
import { Product } from './src/entities/product.entity';
import { Order } from './src/entities/order.entity';
import { Category } from './src/entities/category.entity';
import { User } from './src/entities/user.entity';
import { OrderItem } from './src/entities/order-item.entity';
import { AuditLog } from './src/entities/audit-log.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres:uqYOiTjNGfafaezPxcCROIWsvWSVzfqP@autorack.proxy.rlwy.net:23628/railway',
  entities: [Product, Order, Category, User, OrderItem, AuditLog],
  migrations: ['src/migrations/*.ts'], // Path to your migrations folder
  synchronize: false, // Disable in production to avoid auto-syncing database schema
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
