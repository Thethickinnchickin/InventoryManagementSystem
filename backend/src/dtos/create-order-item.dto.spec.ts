// src/orders/dto/create-order-item.dto.spec.ts
import { validate } from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

describe('CreateOrderItemDto', () => {
  let dto: CreateOrderItemDto;

  beforeEach(() => {
    dto = new CreateOrderItemDto();
  });

  it('should be valid with correct values', async () => {
    dto.orderId = 1;
    dto.productId = 2;
    dto.quantity = 5;
    dto.price = 10.50;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if orderId is not provided', async () => {
    dto.productId = 2;
    dto.quantity = 5;
    dto.price = 10.50;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('orderId');
  });

  it('should fail if productId is not provided', async () => {
    dto.orderId = 1;
    dto.quantity = 5;
    dto.price = 10.50;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('productId');
  });

  it('should fail if quantity is not provided', async () => {
    dto.orderId = 1;
    dto.productId = 2;
    dto.price = 10.50;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
  });

  it('should fail if price is not provided', async () => {
    dto.orderId = 1;
    dto.productId = 2;
    dto.quantity = 5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('price');
  });

  it('should fail if quantity is not an integer', async () => {
    dto.orderId = 1;
    dto.productId = 2;
    dto.quantity = 5.5; // Invalid
    dto.price = 10.50;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
  });

  it('should fail if price is not a decimal', async () => {
    dto.orderId = 1;
    dto.productId = 2;
    dto.quantity = 5;
    dto.price = 10.007; // Invalid, should be decimal

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('price');
  });
});
