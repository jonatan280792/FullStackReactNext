export class TransactionEntity {
  id: string;
  reference: string;
  amountInCents: number;
  status: string;
  createdAt: Date;

  constructor(
    id: string,
    reference: string,
    amountInCents: number,
    status: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.reference = reference;
    this.amountInCents = amountInCents;
    this.status = status;
    this.createdAt = createdAt;
  }
}