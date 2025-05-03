import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const user = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      request.user = user;
      return true;
    } catch (e) {
      throw new Error('Unauthorized');
    }
  }
}
