import { PrismaClient } from "@prisma/client";
import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { ITransactionHistoryRepository } from "../repositories/ITransactionHistoryRepository";
import {
  CreateTransactionHistoryDTO,
  TransactionHistory,
} from "../types/transaction-history";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Decimal } from "@prisma/client/runtime/library";
import Logger from "../utils/logger";

export class TransactionHistoryService {
  private repository: ITransactionHistoryRepository;
  private userRepository: IUserRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new TransactionHistoryRepository(prisma);
    this.userRepository = new UserRepository(prisma);
  }

  async createTransactionHistory(
    data: CreateTransactionHistoryDTO
  ): Promise<TransactionHistory | null> {
    try {
      const senderInfo = await this.userRepository.findById(data.sender_id);
      if (!senderInfo)
        throw new Error("Requester ( user account ) is not found.");

      const receiverInfo = await this.userRepository.findById(data.receiver_id);
      if (!receiverInfo)
        throw new Error("Approver ( user account ) is not found.");

      if (data.type !== "DEPOSIT") {
        if (new Decimal(senderInfo.balance ?? 0) < data.amount)
          throw new Error("You don't have sufficient balance amount.");
        await this.userRepository.update(senderInfo.id, {
          balance: new Decimal(senderInfo.balance ?? 0).minus(data.amount),
        });
        await this.userRepository.update(receiverInfo.id, {
          balance: new Decimal(receiverInfo.balance ?? 0).plus(data.amount),
        });
      } else {
        await this.userRepository.update(senderInfo.id, {
          balance: new Decimal(senderInfo.balance ?? 0).plus(data.amount),
        });
      }

      const new_data = await this.repository.create(data);

      return new_data;
    } catch (error: any) {
      Logger.error(error);
      throw new Error(`${error.message}`);
    }
  }
}
