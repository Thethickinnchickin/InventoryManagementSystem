import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { OrderItem } from './entities/order-item.entity';
import { AuditLog } from './entities/audit-log.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres:luPmgPYzGhQtEfPuJNjKgpDSfLkErytT@switchyard.proxy.rlwy.net:32160/railway',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Product, Order, Category, User, OrderItem, AuditLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
  logging: false,
});
