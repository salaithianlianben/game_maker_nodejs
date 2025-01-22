export interface PaymentGateway {
  id: number;
  name: string;
  logo_path: string;
}

export interface CreatePaymentGatewayDTO {
  name: string;
  logo_path: string;
}

export interface UpdatePaymentGatewayDTO {
  name?: string;
  logo_path?: string;
}
