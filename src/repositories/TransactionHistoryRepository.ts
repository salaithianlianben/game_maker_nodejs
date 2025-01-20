import { PrismaClient } from "@prisma/client";
import { User } from "../types/user";
import { ITransactionHistoryRepository } from "./ITransactionHistoryRepository";
import {
  CreateTransactionHistoryDTO,
  TransactionHistory,
} from "../types/transaction-history";

export class TransactionHistoryRepository
  implements ITransactionHistoryRepository
{
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    sender: true,
    receiver: true,
    payment_request: true,
  };

  async create(
    data: CreateTransactionHistoryDTO
  ): Promise<TransactionHistory | null> {
    return this.prisma.transaction_history.create({
      data: data,
      include: this.includeRelations,
    });
  }
}
