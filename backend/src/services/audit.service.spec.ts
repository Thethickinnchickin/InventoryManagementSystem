import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

describe('AuditService', () => {
  let service: AuditService;
  let auditRepository: Repository<AuditLog>;

  const mockAuditLog = {
    id: 1,
    entityName: 'Order',
    entityId: 1,
    action: 'CREATE',
    changes: { customerName: 'John Doe' },
    performedBy: 'Admin',
    timestamp: new Date(),
  };

  const mockAuditRepository = {
    create: jest.fn().mockReturnValue(mockAuditLog),
    save: jest.fn().mockResolvedValue(mockAuditLog),
    findAndCount: jest.fn().mockResolvedValue([
      [mockAuditLog],
      1,
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditRepository,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    auditRepository = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
  });

  describe('logAction', () => {
    it('should create and save a new audit log entry', async () => {
      await service.logAction('Order', 1, 'CREATE', { customerName: 'John Doe' }, 'Admin');

      expect(auditRepository.create).toHaveBeenCalledWith({
        entityName: 'Order',
        entityId: 1,
        action: 'CREATE',
        changes: { customerName: 'John Doe' },
        performedBy: 'Admin',
      });
      expect(auditRepository.save).toHaveBeenCalledWith(mockAuditLog);
    });
  });

  describe('getAuditLogs', () => {
    it('should return a paginated list of audit logs with total count', async () => {
      const result = await service.getAuditLogs(1, 10, { entityName: 'Order' });

      expect(auditRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          entityName: expect.any(Object), // Expect an object for FindOperator
        }),
        take: 10,
        skip: 0,
        order: {
          timestamp: 'DESC',
        },
      }));
      expect(result).toEqual({
        data: [mockAuditLog],
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });

    it('should return an empty list if no logs match the filters', async () => {
      mockAuditRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.getAuditLogs(1, 10);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
      });
    });
  });
});
