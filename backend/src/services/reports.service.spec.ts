import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderHistoryFilterDto } from '../dtos/order-history-filter.dto';
import { User } from '../entities/user.entity';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let productsRepository: Repository<Product>;
  let ordersRepository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
    productsRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  describe('getStockLevels', () => {
    it('should return a list of stock levels', async () => {
      const mockProducts: Product[] = [
        {
            id: 1,
            name: 'Product A',
            stock: 10,
            description: 'Description of Product A',
            price: 100,
            categories: []
        },
        {
            id: 2,
            name: 'Product B',
            stock: 20,
            description: 'Description of Product B',
            price: 200,
            categories: []
        },
      ];

      jest.spyOn(productsRepository, 'find').mockResolvedValue(mockProducts);

      const result = await reportsService.getStockLevels();
      expect(result).toEqual(mockProducts);
      expect(productsRepository.find).toHaveBeenCalledWith({
        select: ['name', 'stock'],
        order: { stock: 'ASC' },
      });
    });
  });

  describe('getOrderHistory', () => {
    it('should return filtered order history based on filterDto', async () => {
      const filterDto: OrderHistoryFilterDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        customerName: 'John Doe',
        minTotalAmount: '100',
        maxTotalAmount: '500',
      };

      const mockOrders: Order[] = [
        {
            id: 1,
            customerName: 'John Doe',
            totalAmount: 150,
            createdAt: new Date('2024-01-10'),
            items: [],
            shippingAddress: '',
            user: new User,
            deletedAt: undefined
        },
        {
            id: 2,
            customerName: 'Jane Doe',
            totalAmount: 200,
            createdAt: new Date('2024-01-20'),
            items: [],
            shippingAddress: '',
            user: new User,
            deletedAt: undefined
        },
      ];

      jest.spyOn(ordersRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockOrders),
      } as any);

      const result = await reportsService.getOrderHistory(filterDto);
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderHistoryReport', () => {
    it('should return order history report between specified dates', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      const mockReportData = [
        {
          customerName: 'John Doe',
          totalAmount: 150,
          createdAt: new Date('2024-01-10'),
        },
        {
          customerName: 'Jane Doe',
          totalAmount: 200,
          createdAt: new Date('2024-01-20'),
        },
      ];

      jest.spyOn(ordersRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockReportData),
      } as any);

      const result = await reportsService.getOrderHistoryReport(startDate, endDate);
      expect(result).toEqual(mockReportData);
    });
  });
});
