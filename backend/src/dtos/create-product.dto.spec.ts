// src/products/dto/create-product.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

describe('CreateProductDto', () => {
  let dto: CreateProductDto;

  beforeEach(() => {
    dto = new CreateProductDto();
  });

  it('should succeed with valid data', async () => {
    const validProduct = {
      name: 'Laptop',
      description: 'A powerful laptop',
      price: 1299.99,
      stock: 10,
      categoryIds: [1, 2]
    };

    const productDto = plainToInstance(CreateProductDto, validProduct);
    const errors = await validate(productDto);

    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const invalidProduct = {
      name: '',
      description: 'A powerful laptop',
      price: 1299.99,
      stock: 10
    };

    const productDto = plainToInstance(CreateProductDto, invalidProduct);
    const errors = await validate(productDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if description is empty', async () => {
    const invalidProduct = {
      name: 'Laptop',
      description: '',
      price: 1299.99,
      stock: 10
    };

    const productDto = plainToInstance(CreateProductDto, invalidProduct);
    const errors = await validate(productDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail if price is not a decimal', async () => {
    const invalidProduct = {
      name: 'Laptop',
      description: 'A powerful laptop',
      price: 'invalid',
      stock: 10
    };

    const productDto = plainToInstance(CreateProductDto, invalidProduct);
    const errors = await validate(productDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('price');
  });

  it('should fail if stock is negative', async () => {
    const invalidProduct = {
      name: 'Laptop',
      description: 'A powerful laptop',
      price: 1299.99, // valid price
      stock: -5 // invalid stock
    };

    const productDto = plainToInstance(CreateProductDto, invalidProduct);
    const errors = await validate(productDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('stock');
});


  it('should succeed without categoryIds (optional)', async () => {
    const validProduct = {
      name: 'Laptop',
      description: 'A powerful laptop',
      price: 1299.99,
      stock: 10
    };

    const productDto = plainToInstance(CreateProductDto, validProduct);
    const errors = await validate(productDto);

    expect(errors.length).toBe(0);
  });

  it('should fail if categoryIds contains non-numeric values', async () => {
    const invalidProduct = {
      name: 'Laptop',
      description: 'A powerful laptop',
      price: 1299.99,
      stock: 10,
      categoryIds: [1, 'invalid']
    };

    const productDto = plainToInstance(CreateProductDto, invalidProduct);
    const errors = await validate(productDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('categoryIds');
  });
});
