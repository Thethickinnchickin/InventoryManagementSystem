import { IsString, IsOptional, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * Data Transfer Object (DTO) for creating a new user.
 * Used to validate and document the input for user registration.
 */
export class CreateUserDto {
  /**
   * The username of the user.
   * This field is required and must be a string with a length between 3 and 255 characters.
   * @example 'john_doe'
   */
  @ApiProperty({
    description: 'The username of the user',
    type: String, // The username is represented as a string in the API documentation
    minLength: 3, // Minimum length of the username
    maxLength: 255, // Maximum length of the username
    example: 'john_doe', // Example of a username
  })
  @IsString() // Validates that the field must be a string
  @Length(3, 255) // Restricts the length of the string to be between 3 and 255 characters
  username: string; // Field to hold the username of the user

  /**
   * The password for the user account.
   * This field is required and must be a string with a length between 6 and 255 characters.
   * @example 'securePassword123'
   */
  @ApiProperty({
    description: 'The password for the user account',
    type: String, // The password is represented as a string in the API documentation
    minLength: 6, // Minimum length of the password
    maxLength: 255, // Maximum length of the password
    example: 'securePassword123', // Example of a password
  })
  @IsString() // Validates that the field must be a string
  @Length(6, 255) // Restricts the length of the string to be between 6 and 255 characters
  password: string; // Field to hold the password for the user account

  /**
   * The role assigned to the user.
   * This field is optional and, if provided, must be one of the values from the `UserRole` enum.
   * @example UserRole.USER
   */
  @ApiProperty({
    description: 'The role assigned to the user',
    enum: UserRole, // Specifies that the role must be one of the values from the `UserRole` enum
    required: false, // This field is not required
    example: UserRole.USER, // Example of a user role
  })
  @IsOptional() // Indicates that this field is optional
  role?: UserRole; // Optional field to hold the role assigned to the user (e.g., 'user' or 'admin')
}
