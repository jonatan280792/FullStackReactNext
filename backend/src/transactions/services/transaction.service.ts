import { Injectable } from '@nestjs/common';
import { WompiClient } from '../infrastructure/wompi.client';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Result, ok, err } from '@shared/result';
import { generateWompiSignature } from '@utils/rest-utils/integrity.utils';

@Injectable()
export class TransactionService {
  constructor(private readonly wompi: WompiClient) { }

  // Primero llamamos el GET para obtener el token y luego se lo enviamos para la transaccion, por seguridad todo lo hace back
  async create(dto: CreateTransactionDto): Promise<Result<any>> {
    try {
      const merchant = await this.wompi.getMerchantInfo(); // Obtenemos el acceptance_token y lo asignamos al body

      if (!merchant || !merchant.data || !merchant.data.presigned_acceptance?.acceptance_token) {
        return err('No se pudo obtener el token de aceptación del merchant');
      }

      dto.acceptance_token = merchant.data.presigned_acceptance.acceptance_token;

      const signature = generateWompiSignature(
        dto.reference,
        dto.amount_in_cents,
        dto.currency,
        process.env.INTEGRITY_SECRET || ''
      );

      // Firma de integridad
      dto.signature = signature;

      const transaction = await this.wompi.createTransaction(dto);
      return ok(transaction);
    } catch (e) {
      return err('Error al crear la transacción: ' + (e?.message || ''));
    }
  }
}
