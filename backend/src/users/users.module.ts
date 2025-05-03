import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserRepository } from './infrastructure/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/user.entity';
import { JwtAuthModule } from '@utils/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), JwtAuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule { }
