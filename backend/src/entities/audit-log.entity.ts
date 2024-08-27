// src/audit/audit.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: "Product"})
  entityName: string; // Ensure this column is not nullable

  @Column({default: -1})
  entityId: number;

  @Column({default: "N/A"})
  action: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true, default: "ADMIN" })
  performedBy?: string;

  @CreateDateColumn()
  timestamp: Date;
}
