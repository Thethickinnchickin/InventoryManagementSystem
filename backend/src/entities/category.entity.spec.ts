import { Test, TestingModule } from '@nestjs/testing';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';

describe('Category Entity', () => {
  let category: Category;

  beforeEach(async () => {
    // Initialize the Category entity with values
    const sampleProduct = new Product(); // Create a sample Product instance
    sampleProduct.id = 1; // Assign an ID for the Product
    sampleProduct.name = 'Sample Product'; // Assign a name for the Product

    category = new Category();
    category.id = 1;
    category.name = 'Sample Category';
    category.products = [sampleProduct]; // Assign an array of Product instances
  });

  it('should be defined', () => {
    expect(category).toBeDefined();
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(category).toHaveProperty('id');
      expect(typeof category.id).toBe('number');
    });

    it('should have a name property', () => {
      expect(category).toHaveProperty('name');
      expect(typeof category.name).toBe('string');
    });

    it('should have a products property', () => {
      expect(category).toHaveProperty('products');
      expect(Array.isArray(category.products)).toBe(true);
      expect(category.products).toEqual(expect.arrayContaining([expect.any(Product)]));
    });
  });

  describe('Database Schema', () => {
    it('should match the expected database schema', () => {
      // Define the expected schema with adjusted format
      const expectedColumns = [
        { propertyName: 'id', isPrimary: true, isNullable: false, length: '' },
        { propertyName: 'name', isPrimary: false, isNullable: false, length: 255 }
      ];

      // Fetch the actual columns from the metadata storage
      const columnsMetadata = getMetadataArgsStorage().columns
        .filter(col => col.target === Category)
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
