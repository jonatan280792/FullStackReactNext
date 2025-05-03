import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { JwtUtils } from '../../utils/jwt/jwt.utils';
import { err, ok, Result } from '@shared/result';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtUtils: JwtUtils,
  ) {}

  async login(loginDto: LoginDto): Promise<Result<LoginResponseDto>> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user || user.password !== loginDto.password) {
      return err('Correo y/o contraseña incorrecta...', 404);
    }

    const token = this.jwtUtils.generateToken(user);

    const dataResponse: LoginResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    };

    return ok(dataResponse);
  }
}
