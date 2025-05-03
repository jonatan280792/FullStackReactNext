import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../domain/product.entity';
import { Repository } from 'typeorm';
import { Result, ok, err } from '../../shared/result';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>, // Repositorio de TypeORM inyectado
  ) {}

  async create(productData: Partial<ProductEntity>): Promise<Result<ProductEntity>> {
    try {
      // Usamos TypeORM's create() para instanciar el producto.
      const product = this.repo.create(productData);
      // Ahora guardamos el producto en la base de datos.
      await this.repo.save(product);
      return ok(product); // Devolvemos el producto creado envuelto en un Result 'Ok'
    } catch (e) {
      return err('Error creating product: ' + e.message); // Devolvemos un Result 'Err' en caso de error
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.repo.findOneBy({ id });
  }
}
