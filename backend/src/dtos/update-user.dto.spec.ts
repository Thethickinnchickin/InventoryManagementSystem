import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('should pass validation when all required fields are valid', async () => {
    const dto = new UpdateUserDto();
    dto.username = 'john_doe';
    dto.password = 'securepassword123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when username is missing', async () => {
    const dto = new UpdateUserDto();
    dto.password = 'securepassword123'; // Missing username

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('username');
  });

  it('should fail validation when username is not a string', async () => {
    const dto = new UpdateUserDto();
    dto.username = 123 as any; // Invalid type
    dto.password = 'securepassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('username');
  });

  it('should pass validation when password is not provided', async () => {
    const dto = new UpdateUserDto();
    dto.username = 'john_doe';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when password is not a string', async () => {
    const dto = new UpdateUserDto();
    dto.username = 'john_doe';
    dto.password = 123 as any; // Invalid type

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('password');
  });
});
