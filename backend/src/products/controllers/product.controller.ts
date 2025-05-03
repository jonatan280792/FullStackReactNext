import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Result } from '@shared/result';
import { ProductEntity } from '@products/domain/product.entity';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Result<ProductEntity[]>> {
    return this.service.getAllProducts();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getProductById(@Param('id') id: string): Promise<Result<ProductEntity | null>> {
    return this.service.getProductById(id);
  }
}
