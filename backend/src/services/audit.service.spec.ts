// src/audit/audit.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

describe('AuditService', () => {
  let service: AuditService;
  let repository: Repository<AuditLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repository = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
  });

  describe('logAction', () => {
    it('should create and save an audit log', async () => {
      const createSpy = jest.spyOn(repository, 'create').mockReturnValue({} as any);
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(undefined);

      const entityName = 'TestEntity';
      const entityId = 1;
      const action = 'CREATE';
      const changes = { name: 'Test' };
      const performedBy = 'User';

      await service.logAction(entityName, entityId, action, changes, performedBy);

      expect(createSpy).toHaveBeenCalledWith({
        entityName,
        entityId,
        action,
        changes,
        performedBy,
      });
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const mockLogs = [{ id: 1, entityName: 'TestEntity' }] as AuditLog[];
      const total = 1;
      const findAndCountSpy = jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockLogs, total]);

      const page = 1;
      const limit = 10;
      const filters = { entityName: 'TestEntity' };

      const result = await service.getAuditLogs(page, limit, filters);

      expect(findAndCountSpy).toHaveBeenCalledWith({
        where: {
          entityName: Like(`%${filters.entityName}%`),
        },
        take: limit,
        skip: (page - 1) * limit,
        order: {
          timestamp: 'DESC',
        },
      });

      expect(result).toEqual({
        data: mockLogs,
        total,
        page,
        lastPage: 1,
      });
    });
  });
});
