import { PrismaClient } from "@prisma/client";
import { IPaymentAccountRepository } from "./IPaymentAccountRepository";
import {
  CreatePaymentAccountDTO,
  PaymentAccount,
  UpdatePaymentAccountDTO,
} from "../types/payment-account";

export class PaymentAccountRepository
  implements IPaymentAccountRepository
{
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    payment_gateway: true,
  };

  async create(data: CreatePaymentAccountDTO): Promise<PaymentAccount> {
    return this.prisma.agent_payment_account.create({
      data,
      include: this.includeRelations,
    });
  }

  async update(data: UpdatePaymentAccountDTO): Promise<PaymentAccount> {
    const { id, ...updateData } = data;
    return this.prisma.agent_payment_account.update({
      where: { id },
      data: updateData,
      include: this.includeRelations,
    });
  }

  async delete(id: number): Promise<PaymentAccount> {
    return this.prisma.agent_payment_account.delete({
      where: { id },
      include: this.includeRelations,
    });
  }

  async findById(id: number): Promise<PaymentAccount | null> {
    return this.prisma.agent_payment_account.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  async findByAgentId(agentId: number): Promise<PaymentAccount[]> {
    return this.prisma.agent_payment_account.findMany({
      where: { agent_id: agentId },
      include: this.includeRelations,
    });
  }
}
