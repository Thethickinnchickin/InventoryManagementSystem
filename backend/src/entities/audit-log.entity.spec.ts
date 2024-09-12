import { DataSource } from 'typeorm';
import { AuditLog } from './audit-log.entity';

describe('AuditLog Entity', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    // Initialize the DataSource with PostgreSQL configuration for testing
    dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 4545,
      username: 'postgres',
      password: 'matt1234',
      database: 'postgres',
      entities: [AuditLog],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
  });

  afterAll(async () => {
    // Close the database connection
    await dataSource.destroy();
  });

  it('should have the correct table name', () => {
    const metadata = dataSource.getMetadata(AuditLog);
    expect(metadata.tableName).toBe('audit_logs');
  });

  it('should have the correct columns and types', () => {
    const metadata = dataSource.getMetadata(AuditLog);
    const columns = metadata.columns.map(col => ({
      propertyName: col.propertyName,
      type: col.type.constructor.name, // Get constructor name
      length: col.length || '', // Use empty string if length is not defined
      isPrimary: col.isPrimary,
      isNullable: col.isNullable,
    }));

    // Check columns and their properties
    // Check columns and their properties
    expect(columns).toEqual(expect.arrayContaining([
        expect.objectContaining({ propertyName: 'id', type: 'Function', isPrimary: true, isNullable: false }),
        expect.objectContaining({ propertyName: 'entityName', type: 'Function', isPrimary: false, isNullable: false }),
        expect.objectContaining({ propertyName: 'entityId', type: 'Function', isPrimary: false, isNullable: false }),
        expect.objectContaining({ propertyName: 'action', type: 'Function', isPrimary: false, isNullable: false }),
        expect.objectContaining({ propertyName: 'changes', type: 'String', isPrimary: false, isNullable: true }),
        expect.objectContaining({ propertyName: 'performedBy', type: 'String', isPrimary: false, length: '255', isNullable: true }),
        expect.objectContaining({ propertyName: 'timestamp', type: 'String', isPrimary: false, isNullable: false })
    ]));
    
  });

  it('should have the correct default values', async () => {
    const repository = dataSource.getRepository(AuditLog);
    const auditLog = new AuditLog();

    // Set some properties
    auditLog.entityId = 1;
    auditLog.action = 'Update';
    auditLog.changes = { field: 'value' };

    // Save the entity
    await repository.save(auditLog);

    // Fetch it back
    const savedAuditLog = await repository.findOneBy({ id: auditLog.id });

    expect(savedAuditLog).toBeDefined();
    expect(savedAuditLog?.entityName).toBe('Product');
    expect(savedAuditLog?.entityId).toBe(1);
    expect(savedAuditLog?.action).toBe('Update');
    expect(savedAuditLog?.changes).toEqual({ field: 'value' });
    expect(savedAuditLog?.performedBy).toBe('ADMIN');
    expect(savedAuditLog?.timestamp).toBeInstanceOf(Date);
  });
});

