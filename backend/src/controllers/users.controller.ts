import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('users') // Group users-related endpoints in Swagger
@ApiBearerAuth() // Require JWT authentication for all routes in this controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved users' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Successfully updated user' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
