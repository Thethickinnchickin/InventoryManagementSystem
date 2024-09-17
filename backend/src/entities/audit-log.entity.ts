// src/audit/audit.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity representing an audit log entry in the system.
 * This entity tracks changes made to various entities, including the entity name, ID, action performed, and details of the changes.
 */
@Entity('audit_logs')
export class AuditLog {
  /**
   * Unique identifier for each audit log entry.
   * This is an auto-incrementing primary key.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the entity being audited.
   * For example, 'Product' or 'Order'. Defaults to 'Product'.
   */
  @Column({ default: 'Product' })
  entityName: string;

  /**
   * The ID of the entity being audited.
   * Defaults to -1 if not explicitly set.
   */
  @Column({ default: -1 })
  entityId: number;

  /**
   * The action performed on the entity.
   * For example, 'Create', 'Update', or 'Delete'. Defaults to 'N/A'.
   */
  @Column({ default: 'N/A' })
  action: string;

  /**
   * Details of the changes made to the entity.
   * Stored as JSON data, this column is nullable.
   */
  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>;

  /**
   * The user or system that performed the action.
   * Stored as a string with a maximum length of 255 characters. Defaults to 'ADMIN'.
   */
  @Column({ type: 'varchar', length: 255, nullable: true, default: 'ADMIN' })
  performedBy?: string;

  /**
   * The timestamp when the audit log entry was created.
   * Automatically set to the current date and time when the entry is created.
   */
  @CreateDateColumn()
  timestamp: Date;
}

