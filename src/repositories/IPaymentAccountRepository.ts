import {
  CreatePaymentAccountDTO,
  PaymentAccount,
  UpdatePaymentAccountDTO,
} from "../types/payment-account";

export interface IPaymentAccountRepository {
  create(data: CreatePaymentAccountDTO): Promise<PaymentAccount>;
  update(data: UpdatePaymentAccountDTO): Promise<PaymentAccount>;
  delete(id: number): Promise<PaymentAccount>;
  findById(id: number): Promise<PaymentAccount | null>;
  findByAgentId(agentId: number): Promise<PaymentAccount[]>;
}
