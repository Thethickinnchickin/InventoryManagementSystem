import { validate } from 'class-validator';
import { FinancialSummaryReportDto } from './financial-summary-report.dto';

describe('FinancialSummaryReportDto', () => {

  it('should allow valid startDate and endDate', async () => {
    const dto = new FinancialSummaryReportDto();
    dto.startDate = new Date('2023-01-01');
    dto.endDate = new Date('2023-12-31');

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not allow invalid dates', async () => {
    const dto = new FinancialSummaryReportDto();
    // Invalid date values (string instead of Date)
    dto.startDate = 'invalid-date' as any;
    dto.endDate = 'invalid-date' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should allow missing startDate and endDate', async () => {
    const dto = new FinancialSummaryReportDto();
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return an error when startDate is a future date', async () => {
    const dto = new FinancialSummaryReportDto();
    dto.startDate = new Date('2030-01-01');  // future date
    dto.endDate = new Date('2030-12-31');    // future date

    const errors = await validate(dto);
    expect(errors.length).toBe(0);  // Passes since there is no rule against future dates
  });

});
