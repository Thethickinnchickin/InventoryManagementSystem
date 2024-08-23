import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { OrderItem } from 'src/entities/order-item.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
  ) {}

  @Get('metrics')
  async getDashboardMetrics() {
    // Calculate total revenue
    const totalRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalRevenue')
      .getRawOne();
    const totalRevenue = totalRevenueResult.totalRevenue || 0;

    // Get the total number of orders
    const totalOrders = await this.orderRepository.count();

    // Find top-selling products (by total sales)
    const topProducts = await this.orderItemRepository
    .createQueryBuilder('order_item')
    .select('order_item.product_id', 'product_id')
    .addSelect('product.name', 'name')
    .addSelect('SUM(order_item.quantity * order_item.price)', 'total_sales')
    .innerJoin(Product, 'product', 'order_item.product_id = product.id')
    .groupBy('order_item.product_id')
    .addGroupBy('product.name')
    .orderBy('total_sales', 'DESC')
    .limit(5)
    .getRawMany();
  

    // Find low-stock products
    const lowStock = await this.productRepository.find({
      where: {
        stock: LessThan(10), // Using LessThan for proper comparison
      },
      select: ['id', 'name', 'stock'],
    });

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      topProducts,
      lowStock,
    };
  }
}
