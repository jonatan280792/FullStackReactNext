import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Result } from '@shared/result';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('transactions')
@ApiBearerAuth('access-token')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateTransactionDto): Promise<Result<any>> {
    return this.service.create(body);
  }
}
