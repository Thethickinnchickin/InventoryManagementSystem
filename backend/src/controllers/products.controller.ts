import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from '../entities/category.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('products') // Groups the API endpoints related to products under the 'products' section in Swagger UI
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' }) // Provides a summary of the endpoint’s functionality
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number }) // Query parameter for pagination page number
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products per page', type: Number }) // Query parameter for pagination limit
  @ApiQuery({ name: 'isPaginated', required: false, description: 'Flag to enable pagination', type: Boolean }) // Query parameter to enable pagination
  @ApiResponse({ status: 200, description: 'Successfully retrieved all products' }) // Response for successful retrieval
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  findAll(
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to 10 products per page
    @Query('isPaginated') isPaginated: boolean = false, // Default to no pagination
  ): Promise<{ data: Product[]; total: number; page: number; lastPage: number }> {
    return this.productsService.findAll({ page, limit, isPaginated }); // Calls service to retrieve products
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Product ID' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Successfully retrieved the product' }) // Response for successful retrieval
  @ApiResponse({ status: 404, description: 'Product not found' }) // Response when the product is not found
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id); // Calls service to retrieve a specific product by ID
  }

  @Get(':id/categories')
  @ApiOperation({ summary: 'Get categories of a product by its ID' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Product ID' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Successfully retrieved categories for the product' }) // Response for successful retrieval
  @ApiResponse({ status: 404, description: 'Product not found' }) // Response when the product is not found
  async getCategoriesByProduct(@Param('id') id: number): Promise<Category[]> {
    return this.productsService.findCategoriesByProduct(id); // Calls service to retrieve categories of a specific product by ID
  }

  @Get('category/:categoryName')
  @ApiOperation({ summary: 'Get products by category name' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'categoryName', description: 'Category name' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Successfully retrieved products for the category' }) // Response for successful retrieval
  @ApiResponse({ status: 404, description: 'Category not found' }) // Response when the category is not found
  async getProductsByCategory(@Param('categoryName') categoryName: string): Promise<Product[]> {
    return this.productsService.findProductsByCategory(categoryName); // Calls service to retrieve products by category name
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN) // Restricts access to users with Admin role
  @ApiOperation({ summary: 'Create a new product' }) // Provides a summary of the endpoint’s functionality
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 201, description: 'Product successfully created' }) // Response for successful creation
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response for unauthorized access
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto); // Calls service to create a new product
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN) // Restricts access to users with Admin role
  @ApiOperation({ summary: 'Update an existing product by ID' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Product ID' }) // Swagger documentation for the parameter
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 200, description: 'Product successfully updated' }) // Response for successful update
  @ApiResponse({ status: 404, description: 'Product not found' }) // Response when the product is not found
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(id, updateProductDto); // Calls service to update an existing product by ID
  }

  @Put(':id/categories')
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN) // Restricts access to users with Admin role
  @ApiOperation({ summary: 'Update categories for a product by ID' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Product ID' }) // Swagger documentation for the parameter
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 200, description: 'Product categories successfully updated' }) // Response for successful update
  @ApiResponse({ status: 404, description: 'Product not found' }) // Response when the product is not found
  updateCategories(@Param('id') id: number, @Body('categoryIds') categoryIds: number[]): Promise<Product> {
    return this.productsService.updateProductCategories(id, categoryIds); // Calls service to update categories for a specific product by ID
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Protects this route with JWT authentication and role-based authorization
  @Roles(UserRole.ADMIN) // Restricts access to users with Admin role
  @ApiOperation({ summary: 'Delete a product by ID' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Product ID' }) // Swagger documentation for the parameter
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 200, description: 'Product successfully deleted' }) // Response for successful deletion
  @ApiResponse({ status: 404, description: 'Product not found' }) // Response when the product is not found
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id); // Calls service to delete a product by ID
  }
}
