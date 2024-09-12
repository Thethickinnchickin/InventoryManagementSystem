import { Test, TestingModule } from '@nestjs/testing';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';
import { Product } from './product.entity';

describe('Order Entity', () => {
  let order: Order;

  beforeEach(async () => {
    // Initialize the Order entity with values
    const sampleUser = new User(); // Create a sample User instance
    sampleUser.id = 1; // Assign an ID for the User
    sampleUser.username = 'sampleUser'; // Example value for username

    const sampleOrderItem = new OrderItem();
    sampleOrderItem.id = 1;
    sampleOrderItem.quantity = 2;
    sampleOrderItem.price = 50.00;
    sampleOrderItem.order = order; // Set the order for the OrderItem
    sampleOrderItem.product = new Product(); // Create a sample Product instance
    sampleOrderItem.product.id = 1; // Assign an ID for the Product
    sampleOrderItem.product.name = 'Sample Product'; // Example value for product name
  

    order = new Order();
    order.id = 1;
    order.customerName = 'John Doe';
    order.shippingAddress = '123 Main St';
    order.totalAmount = 100.00;
    order.items = [sampleOrderItem]; // Example empty array of OrderItems
    order.user = sampleUser;
    order.deletedAt = new Date(); // Example value for soft deletion
    order.createdAt = new Date(); // Automatically set to the current date/time
  });

  it('should be defined', () => {
    expect(order).toBeDefined();
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(order).toHaveProperty('id');
      expect(typeof order.id).toBe('number');
    });

    it('should have a customerName property', () => {
      expect(order).toHaveProperty('customerName');
      expect(typeof order.customerName).toBe('string');
    });

    it('should have a shippingAddress property', () => {
      expect(order).toHaveProperty('shippingAddress');
      expect(typeof order.shippingAddress).toBe('string');
    });

    it('should have a totalAmount property', () => {
      expect(order).toHaveProperty('totalAmount');
      expect(typeof order.totalAmount).toBe('number');
    });

    it('should have an items property', () => {
      expect(order).toHaveProperty('items');
      expect(Array.isArray(order.items)).toBe(true);
      expect(order.items).toEqual(expect.arrayContaining([expect.any(OrderItem)]));
    });

    it('should have a user property', () => {
      expect(order).toHaveProperty('user');
      expect(order.user).toBeInstanceOf(User);
    });

    it('should have a deletedAt property', () => {
      expect(order).toHaveProperty('deletedAt');
      expect(order.deletedAt).toBeInstanceOf(Date);
    });

    it('should have a createdAt property', () => {
      expect(order).toHaveProperty('createdAt');
      expect(order.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Database Schema', () => {
    it('should match the expected database schema', () => {
      // Define the expected schema
      const expectedColumns = [
        { propertyName: 'id', isPrimary: true, isNullable: false, length: '' },
        { propertyName: 'customerName', isPrimary: false, isNullable: false, length: 255 },
        { propertyName: 'shippingAddress', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'totalAmount', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'deletedAt', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'createdAt', isPrimary: false, isNullable: false, length: '' }
      ];

      // Fetch the actual columns from the metadata storage
      const columnsMetadata = getMetadataArgsStorage().columns
        .filter(col => col.target === Order)
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
