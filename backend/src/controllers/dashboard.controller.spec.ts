import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

describe('DashboardController', () => {
  let controller: DashboardController;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;
  let orderItemRepository: Repository<OrderItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: Repository,
          useValue: {
            createQueryBuilder: jest.fn(),
            count: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({})
    .overrideGuard(RolesGuard)
    .useValue({})
    .compile();

    controller = module.get<DashboardController>(DashboardController);
    orderRepository = module.get<Repository<Order>>(Repository);
    productRepository = module.get<Repository<Product>>(Repository);
    orderItemRepository = module.get<Repository<OrderItem>>(Repository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardMetrics', () => {
    it('should return dashboard metrics', async () => {
      // Mock data
      const totalRevenueResult = { totalRevenue: '1000' };
      const totalOrders = 50;
      const topProducts = [
        { product_id: 1, name: 'Product A', total_sales: 500 },
        { product_id: 2, name: 'Product B', total_sales: 400 },
      ];
      const lowStock: Product[] = [
        { 
          id: 1,
          name: 'Product C',
          stock: 50,
          description: 'A product with low stock', // Add required fields here
          price: 10.0,
          categories: [], // Or mock appropriate data for categories
        },
        { 
          id: 2,
          name: 'Product D',
          stock: 75,
          description: 'Another product with low stock', // Add required fields here
          price: 15.0,
          categories: [], // Or mock appropriate data for categories
        },
      ];

      // Mock the repository methods
      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(totalRevenueResult),
      } as any);

      jest.spyOn(orderRepository, 'count').mockResolvedValue(totalOrders);
      jest.spyOn(orderItemRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(topProducts),
      } as any);

      jest.spyOn(productRepository, 'find').mockResolvedValue(lowStock);

      const result = await controller.getDashboardMetrics();
      expect(result).toEqual({
        revenue: 1000,
        orders: totalOrders,
        topProducts,
        lowStock,
      });
    });
  });
});
