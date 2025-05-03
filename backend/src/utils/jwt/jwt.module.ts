import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@utils/strategies/jwt.strategy';
import { JwtUtils } from '@utils/jwt/jwt.utils';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [JwtStrategy, JwtUtils],
  exports: [JwtUtils, JwtModule], 
})
export class JwtAuthModule { }
