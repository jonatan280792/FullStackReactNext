import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/domain/user.entity';

@Injectable()
export class JwtUtils {
  constructor(private readonly jwtService: JwtService) { }

  generateToken(user: UserEntity) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
