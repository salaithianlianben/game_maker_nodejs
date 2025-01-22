import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionHistoryService } from "./transaction-history.service";
import Logger from "../utils/logger";

export class PaymentService {
  private transactionHistoryService: TransactionHistoryService;

  constructor(prisma: PrismaClient) {
    this.transactionHistoryService = new TransactionHistoryService(prisma);
  }

  async transfer({
    sender_id,
    receiver_id,
    amount,
    remark,
  }: {
    sender_id: number;
    receiver_id: number;
    amount: Decimal;
    remark?: string;
  }) {
    try {
      return this.transactionHistoryService.createTransactionHistory({
        amount: amount,
        receiver_id: receiver_id,
        sender_id: sender_id,
        type: "TRANSFER",
        remark: remark,
      });
    } catch (error: any) {
      Logger.error(error);
      throw new Error(error.message);
    }
  }

  async deposit({
    deposit_by,
    amount,
    remark,
  }: {
    deposit_by: number;
    amount: number;
    remark?: string;
  }) {
    try {
      return this.transactionHistoryService.createTransactionHistory({
        amount: new Decimal(amount),
        receiver_id: deposit_by,
        sender_id: deposit_by,
        type: "DEPOSIT",
        remark: remark,
      });
    } catch (error: any) {
      Logger.error(error);
      throw new Error(error.message);
    }
  }
}
