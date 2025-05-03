import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductService } from '@products/services/product.service';
import { ProductRepository } from '@products/infrastructure/product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@products/domain/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [SeedService, ProductService, ProductRepository],
  exports: [SeedService],
})
export class SeedModule { }
