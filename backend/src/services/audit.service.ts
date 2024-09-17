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

  /**
   * Logs an action performed on an entity.
   * @param entityName - Name of the entity being acted upon.
   * @param entityId - ID of the entity being acted upon.
   * @param action - Description of the action performed.
   * @param changes - The changes made during the action.
   * @param performedBy - Optional. Username or identifier of who performed the action.
   */
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

  /**
   * Retrieves paginated audit logs with optional filters.
   * @param page - The page number for pagination (default: 1).
   * @param limit - Number of records per page (default: 10).
   * @param filters - Optional filters for entityName, action, and performedBy.
   * @returns Paginated audit logs and metadata.
   */
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
