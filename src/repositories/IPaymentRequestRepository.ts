import { CreatePaymentRequestDTO, PaymentRequest, UpdatePaymentRequestDTO } from "../types/payment-request";

export interface IPaymentRequestRepository {
  create(data: CreatePaymentRequestDTO): Promise<PaymentRequest>;
  update(data: UpdatePaymentRequestDTO): Promise<PaymentRequest>;
  delete(id: number): Promise<null>;
  findById(id: number): Promise<PaymentRequest | null>;
  findManyByRequestTo(id:number): Promise<PaymentRequest[] | []>;
  findManyByRequestBy(id: number): Promise<PaymentRequest[] | []>;
}
