import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for changing a user's password.
 * Used to validate and document the input for updating a user's password.
 */
export class ChangePasswordDto {
  /**
   * The new password for the user.
   * @example 'NewP@ssw0rd!'
   */
  @ApiProperty({
    description: 'The new password for the user',
    type: String, // The password is represented as a string in the API documentation
    example: 'NewP@ssw0rd!', // Example of a new password
  })
  @IsString() // Validates that the field must be a string
  password: string; // Field to hold the new password

  /**
   * Confirmation of the new password.
   * @example 'NewP@ssw0rd!'
   */
  @ApiProperty({
    description: 'Confirmation of the new password',
    type: String, // The confirmation password is represented as a string in the API documentation
    example: 'NewP@ssw0rd!', // Example of the confirmation password
  })
  @IsString() // Validates that the field must be a string
  confirmPassword: string; // Field to hold the confirmation of the new password
}

/**
 * Data Transfer Object (DTO) for changing a user's username.
 * Used to validate and document the input for updating a user's username.
 */
export class ChangeUsernameDto {
  /**
   * The new username for the user.
   * @example 'newUsername123'
   */
  @ApiProperty({
    description: 'The new username for the user',
    type: String, // The username is represented as a string in the API documentation
    example: 'newUsername123', // Example of a new username
  })
  @IsString() // Validates that the field must be a string
  username: string; // Field to hold the new username
}
