import { Test, TestingModule } from '@nestjs/testing';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';

describe('Product Entity', () => {
  let product: Product;

  beforeEach(async () => {
    const sampleCategory = new Category();
    sampleCategory.id = 1; // Assign an ID for the Category
    sampleCategory.name = 'Sample Category'; // Example value for name

    product = new Product();
    product.id = 1;
    product.name = 'Sample Product';
    product.description = 'This is a sample product description.';
    product.price = 99.99;
    product.stock = 100;
    product.categories = [sampleCategory]; // Example empty array of Categories
  });

  it('should be defined', () => {
    expect(product).toBeDefined();
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(product).toHaveProperty('id');
      expect(typeof product.id).toBe('number');
    });

    it('should have a name property', () => {
      expect(product).toHaveProperty('name');
      expect(typeof product.name).toBe('string');
    });

    it('should have a description property', () => {
      expect(product).toHaveProperty('description');
      expect(typeof product.description).toBe('string');
    });

    it('should have a price property', () => {
      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('number');
    });

    it('should have a stock property', () => {
      expect(product).toHaveProperty('stock');
      expect(typeof product.stock).toBe('number');
    });

    it('should have a categories property', () => {
      expect(product).toHaveProperty('categories');
      expect(Array.isArray(product.categories)).toBe(true);
      expect(product.categories).toEqual(expect.arrayContaining([expect.any(Category)]));
    });
  });

  describe('Database Schema', () => {
    it('should match the expected database schema', () => {
      // Define the expected schema
      const expectedColumns = [
        { propertyName: 'id', isPrimary: true, isNullable: false, length: '' },
        { propertyName: 'name', isPrimary: false, isNullable: false, length: 255 },
        { propertyName: 'description', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'price', isPrimary: false, isNullable: false, length: '' },
        { propertyName: 'stock', isPrimary: false, isNullable: false, length: '' }
      ];

      // Fetch the actual columns from the metadata storage
      const columnsMetadata = getMetadataArgsStorage().columns
        .filter(col => col.target === Product)
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
