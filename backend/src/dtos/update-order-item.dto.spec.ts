// src/orders/dto/update-order-item.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateOrderItemDto } from './update-order-item.dto';

describe('UpdateOrderItemDto', () => {
  let dto: UpdateOrderItemDto;

  beforeEach(() => {
    dto = new UpdateOrderItemDto();
  });

  it('should succeed with valid data', async () => {
    const validOrderItem = {
      quantity: 3,
      price: 20.50,
      orderId: 1,
      productId: 2,
    };

    const orderItemDto = plainToInstance(UpdateOrderItemDto, validOrderItem);
    const errors = await validate(orderItemDto);

    expect(errors.length).toBe(0);
  });

  it('should fail if quantity is not an integer', async () => {
    const invalidOrderItem = {
      quantity: 3.5, // Invalid: should be an integer
      price: 20.50,
      orderId: 1,
      productId: 2,
    };

    const orderItemDto = plainToInstance(UpdateOrderItemDto, invalidOrderItem);
    const errors = await validate(orderItemDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
  });

  it('should fail if price is not a decimal', async () => {
    const invalidOrderItem = {
      quantity: 3,
      price: 'invalid_price', // Invalid: should be a decimal number
      orderId: 1,
      productId: 2,
    };

    const orderItemDto = plainToInstance(UpdateOrderItemDto, invalidOrderItem);
    const errors = await validate(orderItemDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('price');
  });

  it('should fail if orderId is not provided', async () => {
    const invalidOrderItem = {
      quantity: 3,
      price: 20.50,
      productId: 2,
    };

    const orderItemDto = plainToInstance(UpdateOrderItemDto, invalidOrderItem);
    const errors = await validate(orderItemDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('orderId');
  });

  it('should fail if productId is not provided', async () => {
    const invalidOrderItem = {
      quantity: 3,
      price: 20.50,
      orderId: 1,
    };

    const orderItemDto = plainToInstance(UpdateOrderItemDto, invalidOrderItem);
    const errors = await validate(orderItemDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('productId');
  });
});
