import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from '@products/services/product.service'; // Asegúrate de que el path sea correcto
import { ProductEntity } from '../products/domain/product.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly productService: ProductService) {}

  async seedProducts() {
    const existingResult = await this.productService.getAllProducts();

    existingResult.match(
      (products) => {
        // Si es un Ok, revisamos si hay productos
        if (products.length > 0) {
          this.logger.log('Los productos Dummy ya fueron creados.');
          return;
        }
        // Si no hay productos, procedemos a crear los productos de prueba
        this.createDummyProducts();
      },
      (error) => {
        // Si es un Err, registramos el error
        this.logger.log('Error obteniendo productos: ' + error);
      }
    );
  }

  private async createDummyProducts() {
    const dummyProducts: Partial<ProductEntity>[] = [
      {
        name: 'Teclado MX Series Logi',
        description: 'La serie de teclados MX de Logitech ofrece una variedad de modelos inalámbricos con características como retroiluminación inteligente, diseño ergonómico y compatibilidad multidispositivo. Los teclados MX suelen incluir opciones de conectividad como Bluetooth y Logi Bolt, así como software de personalización como Logi Options+. ',
        price: 523540.00 },
      {
        name: 'Mouse MX Series Logi',
        description: 'Presentamos The Master Series by Logitech, una gama de productos que liberan tu capacidad para crear y hacer realidad tus ideas. Domina tu próximo proyecto con herramientas que transforman tu forma de trabajar: desde revolucionar tu proceso creativo hasta ayudarte a concentrarte y mantenerte en la onda.', price: 352456.99 },
      { 
        name: 'Diadema Logi MX Series',
        description: 'Audífonos / Diadema Con Micrófono Logitech Usb Headset H390 Disfrute de la comodidad: Descubra la comodidad que ofrece este casco telefónico con almohadillas afelpadas y diadema acolchada ajustable. Alto y claro: El micrófono con supresión de ruido reduce el ruido de fondo y se puede apartar si no se está utilizando.',
        price: 265452.99 },
    ];

    for (const p of dummyProducts) {
      await this.productService.createProduct(p);
    }

    this.logger.log('Seeding completed successfully');
  }
}
