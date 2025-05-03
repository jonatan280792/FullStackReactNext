import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { Result } from '@shared/result';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<Result<LoginResponseDto>> {
    return await this.usersService.login(loginDto);
  }
}
