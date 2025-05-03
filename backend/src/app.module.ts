import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { TransactionModule } from './transactions/transaction.module';
import { JwtService } from '@nestjs/jwt';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  ProductsModule,
  TransactionModule,
  UsersModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'paymentdb',
    autoLoadEntities: true,
    synchronize: true, // Solo para desarrollo, en producción debería ser false
  }),
]

const providers = [
  // SeedService
  JwtService
]

@Module({
  imports: imports,
  providers: providers
})
export class AppModule { }
