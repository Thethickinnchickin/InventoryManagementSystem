import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

/**
 * `CategoriesController` handles HTTP requests related to categories.
 * It includes endpoints for creating, reading, updating, and deleting categories.
 */
@ApiTags('categories') // Groups the API endpoints under the 'Categories' section in Swagger UI
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Retrieve all categories.
   * @returns An array of categories.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({ status: 200, description: 'Returns an array of categories', type: [Category] })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  /**
   * Retrieve a specific category by ID.
   * @param id The ID of the category to retrieve.
   * @returns The requested category.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Returns the requested category', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' }) // Optional status for non-existent categories
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  /**
   * Create a new category.
   * @param createCategoryDto Data to create the new category.
   * @returns The created category.
   */
  @Post()
  @ApiBearerAuth() // Shows that this route requires authentication
  @UseGuards(JwtAuthGuard, RolesGuard) // Apply guards for JWT authentication and role checking
  @Roles(UserRole.ADMIN, UserRole.USER) // Define required roles for this endpoint
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'The created category', type: Category })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role.' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Update a category by ID.
   * @param id The ID of the category to update.
   * @param updateCategoryDto Data to update the category.
   * @returns The updated category.
   */
  @Put(':id')
  @ApiBearerAuth() // JWT required for this operation
  @UseGuards(JwtAuthGuard, RolesGuard) // Apply guards for JWT authentication and role checking
  @Roles(UserRole.ADMIN, UserRole.USER) // Define required roles for this endpoint
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID to update' })
  @ApiResponse({ status: 200, description: 'The updated category', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role.' })
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * Delete a category by ID.
   * @param id The ID of the category to delete.
   * @returns Void if successful.
   */
  @Delete(':id')
  @ApiBearerAuth() // JWT required for this operation
  @UseGuards(JwtAuthGuard, RolesGuard) // Apply guards for JWT authentication and role checking
  @Roles(UserRole.ADMIN, UserRole.USER) // Define required roles for this endpoint
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID to delete' })
  @ApiResponse({ status: 204, description: 'Category successfully deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
