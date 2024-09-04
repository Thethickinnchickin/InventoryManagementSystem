import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from '../services/reports.service';
import { AuditService } from '../services/audit.service';
import { AuditLog } from '../entities/audit-log.entity';

describe('ReportsController', () => {
  let controller: ReportsController;
  let reportsService: ReportsService;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: { getStockLevels: jest.fn(), getOrderHistory: jest.fn(), getOrderHistoryReport: jest.fn() },
        },
        {
          provide: AuditService,
          useValue: { getAuditLogs: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
    auditService = module.get<AuditService>(AuditService);
  });

  describe('getAuditLogs', () => {
    it('should return audit logs based on query parameters', async () => {
      const page = 1;
      const limit = 10;
      const entityName = 'Order';
      const action = 'DELETE';
      const performedBy = 'admin';
      const result = {
        data: [
          {
            id: 1,
            entityName: 'Order',
            entityId: 123,
            action: 'DELETE',
            changes: { field1: 'value1', field2: 'value2' },
            performedBy: 'admin',
            timestamp: new Date(),
          },
        ],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      jest.spyOn(auditService, 'getAuditLogs').mockResolvedValue(result);

      expect(await controller.getAuditLogs(page, limit, entityName, action, performedBy)).toBe(result);
    });
  });
});
