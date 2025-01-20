import {
  CreateTransactionHistoryDTO,
  TransactionHistory,
} from "../types/transaction-history";

export interface ITransactionHistoryRepository {
  create(data: CreateTransactionHistoryDTO): Promise<TransactionHistory | null>;
}
