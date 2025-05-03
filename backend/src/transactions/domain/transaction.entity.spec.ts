import { TransactionEntity } from './transaction.entity';

describe('TransactionEntity', () => {
  let transaction: TransactionEntity;

  // Test: Verifica la creación de la instancia de TransactionEntity
  beforeEach(() => {
    transaction = new TransactionEntity(
      '1',
      'reference123',
      1000,
      'completed',
      new Date('2025-05-02T00:00:00Z'),
    );
  });

  it('should create an instance of TransactionEntity', () => {
    expect(transaction).toBeInstanceOf(TransactionEntity);
  });

  it('should assign correct values to properties', () => {
    expect(transaction.id).toBe('1');
    expect(transaction.reference).toBe('reference123');
    expect(transaction.amountInCents).toBe(1000);
    expect(transaction.status).toBe('completed');
    expect(transaction.createdAt).toEqual(new Date('2025-05-02T00:00:00Z'));
  });

  it('should have a property "id" of type string', () => {
    expect(typeof transaction.id).toBe('string');
  });

  it('should have a property "amountInCents" of type number', () => {
    expect(typeof transaction.amountInCents).toBe('number');
  });

  it('should have a property "createdAt" of type Date', () => {
    expect(transaction.createdAt).toBeInstanceOf(Date);
  });
});
