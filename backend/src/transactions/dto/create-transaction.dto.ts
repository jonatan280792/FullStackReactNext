export class CreateTransactionDto {
  amount_in_cents: number;
  tax_in_cents?: number;
  currency: string; // COP
  customer_email: string;
  payment_method: {
    type: PaymentMethodType;
    phone_number: string;
    payment_description?: string;
    user_type?: string;
  };
  // "tax-in-cents": {
  //   VAT: number
  // }
  reference: string;
  acceptance_token?: string;
  signature?: string;
}

// Metodos de pago extraidos del GET merchants response
export enum PaymentMethodType {
  CARD = 'CARD',
  NEQUI = 'NEQUI',
  PSE = 'PSE',
  BANCOLOMBIA_TRANSFER = 'BANCOLOMBIA_TRANSFER',
  BANCOLOMBIA_COLLECT = 'BANCOLOMBIA_COLLECT',
  BANCOLOMBIA_QR = 'BANCOLOMBIA_QR',
  DAVIPLATA = 'DAVIPLATA',
  BANCOLOMBIA_BNPL = 'BANCOLOMBIA_BNPL',
  SU_PLUS = 'SU_PLUS',
}
