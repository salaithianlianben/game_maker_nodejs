import { PaymentGateway } from "../types/payment-gateway";

export interface IPaymentGatewayRepository {
  findById(id: number): Promise<PaymentGateway | null>;
  findMany(): Promise<PaymentGateway[]>;
}
