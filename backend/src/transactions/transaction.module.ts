import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { WompiClient } from './infrastructure/wompi.client';
import { ServiceUtils } from '@utils/rest-utils/http-service.utils';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, WompiClient, ServiceUtils, JwtService],
})
export class TransactionModule { }
