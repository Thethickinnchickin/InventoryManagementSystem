import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('dashboard')  // Groups the endpoint under 'dashboard' in Swagger UI
@ApiBearerAuth()       // Indicates that BearerAuth (JWT) is required
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
  ) {}

  @Get('metrics')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get dashboard metrics for Admin users' })
  @ApiResponse({ status: 200, description: 'Returns metrics including total revenue, order count, top products, and low-stock items' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
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
        stock: LessThan(100), // Using LessThan for proper comparison
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
