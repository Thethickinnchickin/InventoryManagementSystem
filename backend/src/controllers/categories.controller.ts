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

@ApiTags('categories') // Groups the API endpoints under the 'Categories' section in Swagger UI
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({ status: 200, description: 'Returns an array of categories', type: [Category] })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Returns the requested category', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' }) // Optional status for non-existent categories
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth() // Shows that this route requires authentication
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'The created category', type: Category })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role.' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @ApiBearerAuth() // JWT required for this operation
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
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

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID to delete' })
  @ApiResponse({ status: 204, description: 'Category successfully deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
