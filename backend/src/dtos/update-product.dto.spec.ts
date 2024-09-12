// src/products/dto/update-product.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateProductDto } from './update-product.dto';

describe('UpdateProductDto', () => {
  let dto: UpdateProductDto;

  beforeEach(() => {
    dto = new UpdateProductDto();
  });

  it('should succeed with valid data', async () => {
    const validData = {
      name: 'New Product',
      description: 'Description of the product',
      price: 199.99,
      stock: 50,
      categoryIds: [1, 2, 3],
    };

    const dtoInstance = plainToInstance(UpdateProductDto, validData);
    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  it('should fail if name is too short', async () => {
    const invalidData = {
      name: '', // Invalid: name should be at least 1 character long
      description: 'Description of the product',
      price: 199.99,
      stock: 50,
      categoryIds: [1, 2, 3],
    };

    const dtoInstance = plainToInstance(UpdateProductDto, invalidData);
    const errors = await validate(dtoInstance);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if price has more than 2 decimal places', async () => {
    const invalidData = {
      name: 'New Product',
      description: 'Description of the product',
      price: 199.999, // Invalid: price should have at most 2 decimal places
      stock: 50,
      categoryIds: [1, 2, 3],
    };

    const dtoInstance = plainToInstance(UpdateProductDto, invalidData);
    const errors = await validate(dtoInstance);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('price');
  });

  it('should fail if stock is negative', async () => {
    const invalidData = {
      name: 'New Product',
      description: 'Description of the product',
      price: 199.99,
      stock: -5, // Invalid: stock should be 0 or more
      categoryIds: [1, 2, 3],
    };

    const dtoInstance = plainToInstance(UpdateProductDto, invalidData);
    const errors = await validate(dtoInstance);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('stock');
  });

  it('should succeed without optional fields', async () => {
    const validData = {
      // Optional fields omitted
    };

    const dtoInstance = plainToInstance(UpdateProductDto, validData);
    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  it('should fail if categoryIds contains non-numeric values', async () => {
    const invalidData = {
      name: 'New Product',
      description: 'Description of the product',
      price: 199.99,
      stock: 50,
      categoryIds: [1, 'invalid', 3], // Invalid: categoryIds should only contain numbers
    };

    const dtoInstance = plainToInstance(UpdateProductDto, invalidData);
    const errors = await validate(dtoInstance);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('categoryIds');
  });
});
