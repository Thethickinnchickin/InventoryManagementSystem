import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for updating user details.
 * This DTO validates and documents the input for modifying user information.
 */
export class UpdateUserDto {
  /**
   * The new username of the user.
   * This field is required and must be a non-empty string.
   * @example 'newUsername'
   */
  @ApiProperty({
    description: 'The new username of the user.',
    type: String, // The username is represented as a string in the API documentation
    example: 'newUsername', // Example of a new username
  })
  @IsNotEmpty() // Ensures the username is not empty
  @IsString() // Validates that the username must be a string
  username: string; // Field to hold the updated username of the user

  /**
   * The new password for the user.
   * This field is optional and must be a string if provided.
   * Leave this field empty if you are not updating the password.
   * @example 'newPassword123'
   */
  @ApiProperty({
    description: 'The new password for the user. Leave empty if not updating.',
    type: String, // The password is represented as a string in the API documentation
    example: 'newPassword123', // Example of a new password
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsString() // Validates that the password must be a string
  password?: string; // Field to hold the updated password of the user (optional)
}
