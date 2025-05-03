export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface ProductResponse {
  data: Product[];
  message: string;
  success: boolean;
  statusCode: number;
}

export interface Product2Response {
  data: Product;
  message: string;
  success: boolean;
  statusCode: number;
}

export type PaymentMethodType = 'NEQUI' | 'CARD' | 'PSE'; // Ajusta según tus opciones

export interface TransactionPayload {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  payment_method: {
    type: PaymentMethodType;
    phone_number: string;
    payment_description?: string;
    user_type?: string;
  };
}
