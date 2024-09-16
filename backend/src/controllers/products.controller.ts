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

@ApiTags('products') // Group the products-related API endpoints in Swagger UI
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products per page', type: Number })
  @ApiQuery({ name: 'isPaginated', required: false, description: 'Flag to enable pagination', type: Boolean })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all products' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('isPaginated') isPaginated: boolean = false,
  ): Promise<{ data: Product[]; total: number; page: number; lastPage: number }> {
    return this.productsService.findAll({ page, limit, isPaginated });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Get(':id/categories')
  @ApiOperation({ summary: 'Get categories of a product by its ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved categories for the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getCategoriesByProduct(@Param('id') id: number): Promise<Category[]> {
    return this.productsService.findCategoriesByProduct(id);
  }

  @Get('category/:categoryName')
  @ApiOperation({ summary: 'Get products by category name' })
  @ApiParam({ name: 'categoryName', description: 'Category name' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products for the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getProductsByCategory(@Param('categoryName') categoryName: string): Promise<Product[]> {
    return this.productsService.findProductsByCategory(categoryName);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an existing product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Put(':id/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update categories for a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 200, description: 'Product categories successfully updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateCategories(@Param('id') id: number, @Body('categoryIds') categoryIds: number[]): Promise<Product> {
    return this.productsService.updateProductCategories(id, categoryIds);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth() // JWT token required for this endpoint
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
