import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
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
          provide: getRepositoryToken(Order),
          useValue: {
            createQueryBuilder: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
  });

  describe('getDashboardMetrics', () => {
    it('should return dashboard metrics', async () => {
      const totalRevenue = 1000;
      const totalOrders = 50;
      const topProducts = [
        { product_id: 1, name: 'Product A', total_sales: 500 },
        { product_id: 2, name: 'Product B', total_sales: 300 },
      ];
      const lowStock = [
        { id: 1, name: 'Low Stock Product', stock: 50 },
      ];

      // Mock the createQueryBuilder method for orderRepository
      (orderRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ totalRevenue }),
        count: jest.fn().mockResolvedValue(totalOrders),
      });

      // Mock the createQueryBuilder method for orderItemRepository
      (orderItemRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(topProducts),
      });

      (orderRepository.count as jest.Mock).mockResolvedValue(50);  // Ensure this returns a number


      // Mock the find method for productRepository
      (productRepository.find as jest.Mock).mockResolvedValue(lowStock);

      const result = await controller.getDashboardMetrics();

      expect(result).toEqual({
        revenue: totalRevenue,
        orders: totalOrders,
        topProducts,
        lowStock,
      });

      expect(orderRepository.createQueryBuilder).toHaveBeenCalled();
      expect(orderItemRepository.createQueryBuilder).toHaveBeenCalled();
      expect(productRepository.find).toHaveBeenCalled();
    });
  });
});
