import * as crypto from 'crypto';

export function generateWompiSignature(
  reference: string,
  amountInCents: number,
  currency: string,
  integritySecret: string,
  expirationDate?: string
): string {
  const payload = expirationDate
    ? `${reference}${amountInCents}${currency}${expirationDate}${integritySecret}`
    : `${reference}${amountInCents}${currency}${integritySecret}`;

  return crypto.createHash('sha256').update(payload).digest('hex');
}