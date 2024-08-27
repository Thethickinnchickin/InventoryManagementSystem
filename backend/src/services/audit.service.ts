// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async logAction(
    entityName: string,
    entityId: number,
    action: string,
    changes: Record<string, any>,
    performedBy?: string,
  ) {
    const auditLog = this.auditRepository.create({
      entityName,
      entityId,
      action,
      changes,
      performedBy,
    });
    await this.auditRepository.save(auditLog);
  }

  async getAuditLogs(
    page: number = 1,
    limit: number = 10,
    filters: {
      entityName?: string;
      action?: string;
      performedBy?: string;
    } = {},
  ) {
    const where: FindOptionsWhere<AuditLog> = {};

    if (filters.entityName) {
      where.entityName = Like(`%${filters.entityName}%`);
    }
    if (filters.action) {
      where.action = Like(`%${filters.action}%`);
    }
    if (filters.performedBy) {
      where.performedBy = Like(`%${filters.performedBy}%`);
    }

    const [logs, total] = await this.auditRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: {
        timestamp: 'DESC',
      },
    });

    return {
      data: logs,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
