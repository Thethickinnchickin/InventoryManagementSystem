import { validate } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

describe('CreateCategoryDto', () => {
  it('should pass validation when all fields are valid', async () => {
    const dto = new CreateCategoryDto();
    dto.name = 'Valid Category Name';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when name is missing', async () => {
    const dto = new CreateCategoryDto();
    // Intentionally leaving `name` empty

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors due to missing name
  });

  it('should fail validation when name is not a string', async () => {
    const dto = new CreateCategoryDto();
    dto.name = 123 as unknown as string; // Casting to bypass TypeScript type checking

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors due to incorrect type
  });

  it('should fail validation when name is too long', async () => {
    const dto = new CreateCategoryDto();
    dto.name = 'A'.repeat(256); // Name length exceeds the maximum allowed length

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors due to name being too long
  });
});
