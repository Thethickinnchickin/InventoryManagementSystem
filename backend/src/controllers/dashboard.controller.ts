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
@ApiBearerAuth()       // Indicates that BearerAuth (JWT) is required for this endpoint
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard) // Guards to ensure JWT authentication and role-based access
export class DashboardController {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
  ) {}

  @Get('metrics')
  @Roles(UserRole.ADMIN) // Restricts access to users with the ADMIN role
  @ApiOperation({ summary: 'Get dashboard metrics for Admin users' }) // Describes what this endpoint does
  @ApiResponse({ status: 200, description: 'Returns metrics including total revenue, order count, top products, and low-stock items' }) // Successful response
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response when user does not have required role
  async getDashboardMetrics() {
    // Calculate total revenue from all orders
    const totalRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalRevenue') // Sum of all totalAmount fields
      .getRawOne();
    const totalRevenue = totalRevenueResult.totalRevenue || 0; // Default to 0 if no revenue is found

    // Get the total number of orders
    const totalOrders = await this.orderRepository.count();

    // Find top-selling products based on total sales
    const topProducts = await this.orderItemRepository
      .createQueryBuilder('order_item')
      .select('order_item.product_id', 'product_id')
      .addSelect('product.name', 'name')
      .addSelect('SUM(order_item.quantity * order_item.price)', 'total_sales') // Calculate total sales for each product
      .innerJoin(Product, 'product', 'order_item.product_id = product.id') // Join with Product to get product names
      .groupBy('order_item.product_id')
      .addGroupBy('product.name')
      .orderBy('total_sales', 'DESC') // Order by total sales in descending order
      .limit(5) // Limit to top 5 products
      .getRawMany();

    // Find products with stock less than 100
    const lowStock = await this.productRepository.find({
      where: {
        stock: LessThan(100), // Filter products with stock less than 100
      },
      select: ['id', 'name', 'stock'], // Select only necessary fields
    });

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      topProducts,
      lowStock,
    };
  }
}
