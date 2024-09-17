import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditService } from '../services/audit.service';

/**
 * The AuditModule is responsible for managing audit log functionality within the application.
 * It integrates with TypeORM to handle the `AuditLog` entity and provides an `AuditService`
 * to encapsulate business logic related to audit logging.
 */
@Module({
  /**
   * Imports the TypeOrmModule with the `AuditLog` entity.
   * This makes the `AuditLog` entity available for dependency injection and allows
   * interaction with the audit log database table.
   */
  imports: [TypeOrmModule.forFeature([AuditLog])],

  /**
   * Registers the `AuditService` as a provider in this module.
   * The `AuditService` contains the business logic for creating and managing audit logs.
   */
  providers: [AuditService],

  /**
   * Exports the `AuditService` to make it available to other modules that import this module.
   * This allows other parts of the application to use the audit logging functionality provided
   * by the `AuditService`.
   */
  exports: [AuditService],
})
export class AuditModule {}
