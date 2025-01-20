import { PaymentGateway } from "./payment-gateway";

export interface PaymentAccount {
  id: number;
  agent_id: number;
  payment_gateway_id: number;
  account_number: string;
  account_name: string;
  payment_gateway?: PaymentGateway;
}

export interface CreatePaymentAccountDTO {
  agent_id: number;
  payment_gateway_id: number;
  account_number: string;
  account_name: string;
}

export interface UpdatePaymentAccountDTO {
  id: number;
  payment_gateway_id?: number;
  account_number?: string;
  account_name?: string;
}
