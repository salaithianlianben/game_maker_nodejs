import {
  CreatePaymentGatewayDTO,
  PaymentGateway,
  UpdatePaymentGatewayDTO,
} from "../types/payment-gateway";

export interface IPaymentGatewayRepository {
  create(data: CreatePaymentGatewayDTO): Promise<PaymentGateway | null>;
  update(
    id: number,
    data: UpdatePaymentGatewayDTO
  ): Promise<PaymentGateway | null>;
  findById(id: number): Promise<PaymentGateway | null>;
  findMany(): Promise<PaymentGateway[]>;
}
