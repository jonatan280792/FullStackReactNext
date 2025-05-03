import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './domain/product.entity';
import { ProductRepository } from './infrastructure/product.repository';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { SeedModule } from '@seed/seed.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), SeedModule],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService, JwtService],
})
export class ProductsModule {}