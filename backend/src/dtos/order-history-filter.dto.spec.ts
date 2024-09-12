import { validate } from 'class-validator';
import { OrderHistoryFilterDto } from './order-history-filter.dto';

describe('OrderHistoryFilterDto', () => {
  it('should pass validation when all fields are valid', async () => {
    const dto = new OrderHistoryFilterDto();
    dto.startDate = '2024-01-01T00:00:00Z';
    dto.endDate = '2024-12-31T23:59:59Z';
    dto.customerName = 'John Doe';
    dto.minTotalAmount = '100';
    dto.maxTotalAmount = '500';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when startDate is not a valid date string', async () => {
    const dto = new OrderHistoryFilterDto();
    dto.startDate = 'invalid-date'; // Invalid date string

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should fail validation when endDate is not a valid date string', async () => {
    const dto = new OrderHistoryFilterDto();
    dto.endDate = 'invalid-date'; // Invalid date string

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should fail validation when minTotalAmount is not a valid number string', async () => {
    const dto = new OrderHistoryFilterDto();
    dto.minTotalAmount = 'not-a-number'; // Invalid number string

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should fail validation when maxTotalAmount is not a valid number string', async () => {
    const dto = new OrderHistoryFilterDto();
    dto.maxTotalAmount = 'not-a-number'; // Invalid number string

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should pass validation when optional fields are not provided', async () => {
    const dto = new OrderHistoryFilterDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors expected
  });

  it('should pass validation when optional fields are partially provided', async () => {
    const dto = new OrderHistoryFilterDto();
    dto.startDate = '2024-01-01T00:00:00Z';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors expected
  });
});
