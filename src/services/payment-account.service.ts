import { PrismaClient } from "@prisma/client";

import {
  CreatePaymentAccountDTO,
  PaymentAccount,
  UpdatePaymentAccountDTO,
} from "../types/payment-account";
import { IPaymentAccountRepository } from "../repositories/IPaymentAccountRepository";
import { PaymentAccountRepository } from "../repositories/PaymentAccountRepository";

export class PaymentAccountService {
  private repository: IPaymentAccountRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new PaymentAccountRepository(prisma);
  }

  async createPaymentAccount(
    data: CreatePaymentAccountDTO
  ): Promise<PaymentAccount> {
    try {
      if (!data.account_number || !data.account_name) {
        throw new Error("Account number and name are required");
      }

      return await this.repository.create(data);
    } catch (error: any) {
      throw new Error(
        `Service error creating payment account: ${error.message}`
      );
    }
  }

  async updatePaymentAccount(
    data: UpdatePaymentAccountDTO
  ): Promise<PaymentAccount> {
    try {
      const existingAccount = await this.repository.findById(data.id);
      if (!existingAccount) {
        throw new Error("Payment account not found");
      }

      return await this.repository.update(data);
    } catch (error: any) {
      throw new Error(
        `Service error updating payment account: ${error.message}`
      );
    }
  }

  async deletePaymentAccount(id: number): Promise<void> {
    try {
      const existingAccount = await this.repository.findById(id);
      if (!existingAccount) {
        throw new Error("Payment account not found");
      }

      await this.repository.delete(id);
    } catch (error: any) {
      throw new Error(
        `Service error deleting payment account: ${error.message}`
      );
    }
  }

  async getPaymentAccountById(id: number): Promise<PaymentAccount> {
    try {
      const account = await this.repository.findById(id);
      if (!account) {
        throw new Error("Payment account not found");
      }
      return account;
    } catch (error: any) {
      throw new Error(
        `Service error fetching payment account: ${error.message}`
      );
    }
  }

  async getPaymentAccountsByAgentId(
    agentId: number
  ): Promise<PaymentAccount[]> {
    try {
      return await this.repository.findByAgentId(agentId);
    } catch (error: any) {
      throw new Error(
        `Service error fetching agent payment accounts: ${error.message}`
      );
    }
  }
}
