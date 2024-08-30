import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from 'src/entities/category.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1, // Default page to 1
    @Query('limit') limit: number = 10, // Default limit to 10
    @Query('isPaginated') isPaginated: boolean = false,
  ): Promise<{ data: Product[]; total: number; page: number; lastPage: number }> {
    return this.productsService.findAll({ page, limit, isPaginated });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Get(':id/categories')
  async getCategoriesByProduct(@Param('id') id: number): Promise<Category[]> {
    return this.productsService.findCategoriesByProduct(id);
  }

  @Get('category/:categoryName')
  async getProductsByCategory(@Param('categoryName') categoryName: string): Promise<Product[]> {
    return this.productsService.findProductsByCategory(categoryName);
  }


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }


  @Put(':id/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateCategories(@Param('id') id: number, @Body('categoryIds') categoryIds: number[]): Promise<Product> {
    console.log(categoryIds)
    return this.productsService.updateProductCategories(id, categoryIds);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
