import { TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { User } from "./user";
import { PaymentRequest } from "./payment-request";

export type TransactionHistory = {
  id: number;
  type: TransactionType;
  amount: Decimal;
  sender_id: number;
  receiver_id: number;
  payment_request_id: number | null;
  created_at: Date;
  sender: User | null;
  receiver: User | null;
  payment_request: PaymentRequest | null;
};

export interface CreateTransactionHistoryDTO {
  type: TransactionType;
  amount: Decimal;
  sender_id: number;
  receiver_id: number;
  payment_request_id: number | null;
}
