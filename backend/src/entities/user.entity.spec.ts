import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from './user.entity';
import { Order } from './order.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';

describe('User Entity', () => {
  let user: User;

  beforeEach(async () => {
    // Initialize the User entity with values
    user = new User();
    user.id = 1;
    user.username = 'sampleUser';
    user.password = 'securePassword';
    user.role = UserRole.ADMIN;

    // Initialize a sample Order entity
    const sampleOrder = new Order();
    sampleOrder.id = 1;
    sampleOrder.customerName = 'John Doe';
    sampleOrder.shippingAddress = '123 Main St';
    sampleOrder.totalAmount = 100.00;
    sampleOrder.items = []; // Example empty array of OrderItems
    sampleOrder.user = user; // Set the user for the order
    sampleOrder.deletedAt = null; // No soft deletion
    sampleOrder.createdAt = new Date(); // Automatically set to the current date/time

    // Assign the sample order to the user's orders
    user.orders = [sampleOrder];
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(user).toHaveProperty('id');
      expect(typeof user.id).toBe('number');
    });

    it('should have a username property', () => {
      expect(user).toHaveProperty('username');
      expect(typeof user.username).toBe('string');
    });

    it('should have a password property', () => {
      expect(user).toHaveProperty('password');
      expect(typeof user.password).toBe('string');
    });

    it('should have a role property', () => {
      expect(user).toHaveProperty('role');
      expect(Object.values(UserRole)).toContain(user.role);
    });

    it('should have an orders property', () => {
      expect(user).toHaveProperty('orders');
      expect(Array.isArray(user.orders)).toBe(true);
      expect(user.orders).toEqual(expect.arrayContaining([expect.any(Order)]));
    });
  });

  describe('Database Schema', () => {
    it('should match the expected database schema', () => {
      // Define the expected schema
      const expectedColumns = [
        { propertyName: 'id', isPrimary: true, isNullable: false, length: '' },
        { propertyName: 'username', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'password', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'role', isPrimary: false, isNullable: false, length: '' },
      ];

      // Fetch the actual columns from the metadata storage
      const columnsMetadata = getMetadataArgsStorage().columns
        .filter(col => col.target === User)
        .map((col: ColumnMetadataArgs) => ({
          propertyName: col.propertyName,
          isPrimary: col.options?.primary || false,
          isNullable: col.options?.nullable || false,
          length: col.options?.length || ''
        }));

      // Compare the actual columns with the expected columns
      expect(columnsMetadata).toEqual(expect.arrayContaining(expectedColumns));
    });
  });
});
