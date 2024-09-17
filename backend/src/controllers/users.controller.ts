import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('users') // Groups users-related API endpoints under the 'users' section in Swagger UI
@ApiBearerAuth() // Requires JWT authentication for all routes in this controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN) // Restricts access to this route to users with the ADMIN role
  @ApiOperation({ summary: 'Get all users' }) // Provides a summary of what this endpoint does
  @ApiResponse({ status: 200, description: 'Successfully retrieved users' }) // Response for successful retrieval of all users
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  findAll(): Promise<User[]> {
    return this.usersService.findAll(); // Calls service to retrieve all users
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN, UserRole.USER) // Allows access to this route for both ADMIN and USER roles
  @ApiOperation({ summary: 'Get a user by ID' }) // Provides a summary of what this endpoint does
  @ApiParam({ name: 'id', description: 'User ID', type: Number }) // Parameter description for user ID
  @ApiResponse({ status: 200, description: 'Successfully retrieved user' }) // Response for successful retrieval of a single user
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  @ApiResponse({ status: 404, description: 'User not found' }) // Response when the user is not found
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id); // Calls service to retrieve a user by ID
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Provides a summary of what this endpoint does
  @ApiBody({ type: CreateUserDto }) // Describes the body of the request as a CreateUserDto object
  @ApiResponse({ status: 201, description: 'User successfully registered' }) // Response for successful user registration
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input' }) // Response for invalid input
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto); // Calls service to register a new user
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN) // Restricts access to this route to users with the ADMIN role
  @ApiOperation({ summary: 'Update a user by ID' }) // Provides a summary of what this endpoint does
  @ApiParam({ name: 'id', description: 'User ID', type: Number }) // Parameter description for user ID
  @ApiBody({ type: UpdateUserDto }) // Describes the body of the request as an UpdateUserDto object
  @ApiResponse({ status: 200, description: 'Successfully updated user' }) // Response for successful user update
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  @ApiResponse({ status: 404, description: 'User not found' }) // Response when the user is not found
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto); // Calls service to update a user by ID
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN) // Restricts access to this route to users with the ADMIN role
  @ApiOperation({ summary: 'Delete a user by ID' }) // Provides a summary of what this endpoint does
  @ApiParam({ name: 'id', description: 'User ID', type: Number }) // Parameter description for user ID
  @ApiResponse({ status: 204, description: 'User successfully deleted' }) // Response for successful user deletion
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  @ApiResponse({ status: 404, description: 'User not found' }) // Response when the user is not found
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id); // Calls service to delete a user by ID
  }
}
