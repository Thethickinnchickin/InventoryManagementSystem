import { validate } from 'class-validator';
import { OrderHistoryReportDto } from './order-history-report.dto';

describe('OrderHistoryReportDto', () => {

  it('should allow valid startDate, endDate, and customerName', async () => {
    const dto = new OrderHistoryReportDto();
    dto.startDate = new Date('2023-01-01');
    dto.endDate = new Date('2023-12-31');
    dto.customerName = 'John Doe';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors expected
  });

  it('should not allow invalid dates', async () => {
    const dto = new OrderHistoryReportDto();
    // Invalid date values (strings instead of Date objects)
    dto.startDate = 'invalid-date' as any;
    dto.endDate = 'invalid-date' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors for dates
  });

  it('should not allow a non-string customerName', async () => {
    const dto = new OrderHistoryReportDto();
    dto.customerName = 123 as any; // Invalid: customerName must be a string

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors for customerName
  });

  it('should allow missing startDate, endDate, and customerName', async () => {
    const dto = new OrderHistoryReportDto();
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors expected for optional fields
  });

  it('should allow valid customerName', async () => {
    const dto = new OrderHistoryReportDto();
    dto.customerName = 'Jane Doe'; // Valid string

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors expected
  });

});
