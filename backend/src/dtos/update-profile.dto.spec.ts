import { validate } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

describe('UpdateProfileDto', () => {
  it('should pass validation when all optional fields are valid', async () => {
    const dto = new UpdateProfileDto();
    dto.username = 'john_doe';
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when username is not a string', async () => {
    const dto = new UpdateProfileDto();
    dto.username = 123 as any; // Invalid type
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should fail validation when email is not a valid email', async () => {
    const dto = new UpdateProfileDto();
    dto.username = 'john_doe';
    dto.email = 'not_an_email'; // Invalid email

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
  });

  it('should pass validation when optional fields are not provided', async () => {
    const dto = new UpdateProfileDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
