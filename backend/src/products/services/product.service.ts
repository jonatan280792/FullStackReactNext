import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../infrastructure/product.repository';
import { err, ok, Result } from '@shared/result';
import { ProductEntity } from '../domain/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly repo: ProductRepository) { }

  async getAllProducts(): Promise<Result<ProductEntity[]>> {
    try {
      const products = await this.repo.findAll();
      products.forEach(item => {
        item.priceIva =  item.price * 19 /100
      });
      return ok(products);
    } catch (e) {
      return err('Ah ocurrido un error al obtener los productos...', 404);
    }
  }

  async getProductById(id: string): Promise<Result<ProductEntity | null>> {
    try {
      const product = await this.repo.findById(id);
      return ok(product);
    } catch (e) {
      return err('Ah ocurrido un error al obtener los productos...', 404);
    }
  }

  async createProduct(data: Partial<ProductEntity>): Promise<Result<ProductEntity>> {
    try {
      // Creamos una nueva entidad de producto y la guardamos.
      return await this.repo.create(data);
    } catch (e) {
      return err('Ah ocurrido un error crear la transacción...', 404);
    }
  }
}
