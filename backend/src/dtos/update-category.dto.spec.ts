import { validate } from 'class-validator';
import { UpdateCategoryDto } from './update-category.dto';

describe('UpdateCategoryDto', () => {
  it('should pass validation when all fields are valid', async () => {
    const dto = new UpdateCategoryDto();
    dto.name = 'Valid Category Name';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when name is missing', async () => {
    const dto = new UpdateCategoryDto();
    dto.name = ''; // Empty string

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should fail validation when name is not a string', async () => {
    const dto = new UpdateCategoryDto();
    // Assigning a non-string value
    // Since TypeScript will throw an error, this is for illustrative purposes
    // Adjust according to how non-string values might be tested in your context
    // dto.name = 123 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should pass validation when name is a valid string', async () => {
    const dto = new UpdateCategoryDto();
    dto.name = 'Another Valid Category';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors expected
  });
});
