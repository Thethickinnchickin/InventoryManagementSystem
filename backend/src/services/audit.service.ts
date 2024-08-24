// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
