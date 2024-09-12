import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from '../services/reports.service';
import { AuditService } from '../services/audit.service';
import { Product } from '../entities/product.entity';
import { OrderHistoryFilterDto } from '../dtos/order-history-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

describe('ReportsController', () => {
  let controller: ReportsController;
  let reportsService: ReportsService;
  let auditService: AuditService;

  const mockProducts: Product[] = [
    { id: 1, name: 'Product A', stock: 100 } as Product,
    { id: 2, name: 'Product B', stock: 50 } as Product,
  ];

  const mockOrderHistory = [
    { orderId: 1, productId: 1, quantity: 10, totalAmount: 100 } as any,
    { orderId: 2, productId: 2, quantity: 5, totalAmount: 50 } as any,
  ];

  const mockOrderHistoryReport = {
    totalOrders: 2,
    totalAmount: 150,
  };

  const mockAuditLogs = [
    { id: 1, entityName: 'Product', action: 'UPDATE', performedBy: 'admin', timestamp: new Date() },
  ];

  const mockReportsService = {
    getStockLevels: jest.fn().mockResolvedValue(mockProducts),
    getOrderHistory: jest.fn().mockResolvedValue(mockOrderHistory),
    getOrderHistoryReport: jest.fn().mockResolvedValue(mockOrderHistoryReport),
  };

  const mockAuditService = {
    getAuditLogs: jest.fn().mockResolvedValue(mockAuditLogs),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
    auditService = module.get<AuditService>(AuditService);
  });

  describe('getStockLevels', () => {
    it('should return product stock levels', async () => {
      const result = await controller.getStockLevels();
      expect(result).toEqual(mockProducts);
      expect(reportsService.getStockLevels).toHaveBeenCalled();
    });
  });

  describe('getOrderHistory', () => {
    it('should return order history based on filter', async () => {
      const filterDto: OrderHistoryFilterDto = {};
      const result = await controller.getOrderHistory(filterDto);
      expect(result).toEqual(mockOrderHistory);
      expect(reportsService.getOrderHistory).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('getOrderHistoryReport', () => {
    it('should return order history report for the given date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const result = await controller.getOrderHistoryReport(startDate, endDate);
      expect(result).toEqual(mockOrderHistoryReport);
      expect(reportsService.getOrderHistoryReport).toHaveBeenCalledWith(startDate, endDate);
    });
  });

  describe('getAuditLogs', () => {
    it('should return audit logs with pagination and optional filters', async () => {
      const page = 1;
      const limit = 10;
      const entityName = 'Product';
      const action = 'UPDATE';
      const performedBy = 'admin';
      const result = await controller.getAuditLogs(page, limit, entityName, action, performedBy);
      expect(result).toEqual(mockAuditLogs);
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(page, limit, { entityName, action, performedBy });
    });
  });
});
