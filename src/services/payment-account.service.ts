// import {
//   deletePaymentAccount,
//   getAgentPaymentAccountById,
//   getAgentPaymentAccountsByAgentId,
//   insertAgentPaymentAccount,
//   updatePaymentAccount,
// } from "../models/agent_payment_account.model";

// const addAgentPaymentAccount = async ({
//   agent_id,
//   payment_gateway_id,
//   account_number,
//   account_name,
// }: {
//   agent_id: number;
//   payment_gateway_id: number;
//   account_number: string;
//   account_name: string;
// }) => {
//   try {
//     const data = await insertAgentPaymentAccount({
//       account_name,
//       agent_id,
//       payment_gateway_id,
//       account_number,
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// const fetchAgentPaymentAccounts = async (agent_id: number) => {
//   try {
//     const data = await getAgentPaymentAccountsByAgentId(agent_id);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// const fetchAgentPaymentAccountDetail = async (id: number) => {
//   try {
//     const data = await getAgentPaymentAccountById(id);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// const removeAgentPaymentAccount = async (id: number) => {
//   try {
//     return await deletePaymentAccount(id);
//   } catch (error) {
//     throw error;
//   }
// };

// const modifyAgentPaymentAccount = async ({
//   id,
//   account_number,
//   account_name,
//   payment_gateway_id,
// }: {
//   payment_gateway_id?: number;
//   account_number?: string;
//   account_name?: string;
//   id: number;
// }) => {
//   try {
//     return await updatePaymentAccount({
//       id,
//       payment_gateway_id,
//       account_name,
//       account_number,
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// export {
//   addAgentPaymentAccount,
//   fetchAgentPaymentAccounts,
//   removeAgentPaymentAccount,
//   modifyAgentPaymentAccount,
//   fetchAgentPaymentAccountDetail,
// };

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
