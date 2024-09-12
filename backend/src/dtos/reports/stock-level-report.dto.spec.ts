import { validate } from 'class-validator';
import { StockLevelReportDto } from './stock-level-report.dto';

describe('StockLevelReportDto', () => {
  it('should pass validation when all fields are valid', async () => {
    const dto = new StockLevelReportDto();
    dto.category = 'Electronics';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation when fields are optional and missing', async () => {
    const dto = new StockLevelReportDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No errors should occur
  });

  it('should fail validation when category is not a string', async () => {
    const dto = new StockLevelReportDto();
    (dto as any).category = 123; // Invalid type

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
