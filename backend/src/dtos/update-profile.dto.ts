import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for updating user profile information.
 * Used to validate and document the input for modifying user profile details.
 */
export class UpdateProfileDto {
  /**
   * The new username of the user.
   * This field is optional and must be a string if provided.
   * @example 'newUsername'
   */
  @ApiProperty({
    description: 'The new username of the user.',
    type: String, // The username is represented as a string in the API documentation
    example: 'newUsername', // Example of a new username
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsString() // Validates that the field must be a string
  username?: string; // Field to hold the updated username of the user

  /**
   * The new email address of the user.
   * This field is optional and must be a valid email address if provided.
   * @example 'user@example.com'
   */
  @ApiProperty({
    description: 'The new email address of the user.',
    type: String, // The email address is represented as a string in the API documentation
    example: 'user@example.com', // Example of a new email address
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsEmail() // Validates that the field must be a valid email address
  email?: string; // Field to hold the updated email address of the user
}
