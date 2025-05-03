import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from '@seed/seed.service';
import { HttpExceptionFilter } from '@interceptors/http-exception';
import { ResponseInterceptor } from '@interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());         // Establece headers seguros
  app.use(compression());   // Comprime las respuestas

  app.enableCors({
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const seedService = app.get(SeedService);
  await seedService.seedProducts();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API de prueba técnica')
    .setDescription('Documentación de endpoints del backend')
    .setVersion('1.0')
    .addBearerAuth() // para JWT si usas autenticación
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
