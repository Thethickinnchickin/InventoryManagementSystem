import { Test, TestingModule } from '@nestjs/testing';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';

describe('OrderItem Entity', () => {
  let orderItem: OrderItem;

  beforeEach(async () => {
    // Initialize the OrderItem entity with values
    const sampleOrder = new Order(); // Create a sample Order instance
    sampleOrder.id = 1; // Assign an ID for the Order

    const sampleProduct = new Product(); // Create a sample Product instance
    sampleProduct.id = 1; // Assign an ID for the Product
    sampleProduct.name = 'Sample Product'; // Assign a name for the Product

    orderItem = new OrderItem();
    orderItem.id = 1;
    orderItem.order = sampleOrder;
    orderItem.product = sampleProduct;
    orderItem.quantity = 10;
    orderItem.price = 99.99;
    orderItem.deletedAt = new Date(); // Example value for soft deletion
  });

  it('should be defined', () => {
    expect(orderItem).toBeDefined();
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(orderItem).toHaveProperty('id');
      expect(typeof orderItem.id).toBe('number');
    });

    it('should have an order property', () => {
      expect(orderItem).toHaveProperty('order');
      expect(orderItem.order).toBeInstanceOf(Order);
    });

    it('should have a product property', () => {
      expect(orderItem).toHaveProperty('product');
      expect(orderItem.product).toBeInstanceOf(Product);
    });

    it('should have a quantity property', () => {
      expect(orderItem).toHaveProperty('quantity');
      expect(typeof orderItem.quantity).toBe('number');
    });

    it('should have a price property', () => {
      expect(orderItem).toHaveProperty('price');
      expect(typeof orderItem.price).toBe('number');
    });

    it('should have a deletedAt property', () => {
      expect(orderItem).toHaveProperty('deletedAt');
      expect(orderItem.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('Database Schema', () => {
    it('should match the expected database schema', () => {
      // Define the expected schema
      const expectedColumns = [
        { propertyName: 'id', isPrimary: true, isNullable: false, length: '' },
        { propertyName: 'quantity', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'price', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'deletedAt', isPrimary: false, isNullable: false, length: '' }
      ];

      // Fetch the actual columns from the metadata storage
      const columnsMetadata = getMetadataArgsStorage().columns
        .filter(col => col.target === OrderItem)
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
