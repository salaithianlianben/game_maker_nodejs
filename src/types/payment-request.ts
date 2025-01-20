import { User } from "./user";
import { PaymentGateway } from "./payment-gateway";
import { z } from "zod";
import { depositPaymentRequestSchema } from "../schema/payment-request.schema";
import { RequestStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type PaymentRequest = {
  id: number;
  type: TransactionType;
  status: RequestStatus;
  request_by: number;
  request_to: number;
  requestBy?: User;
  requestTo?: User;
  payment_proof_path: string | null;
  invoice: string;
  agent_payment_account_id: number | null;
  account_number: string | null;
  account_name: string | null;
  payment_gateway_id: number;
  payment_gateway?: PaymentGateway;
  reference_code_suffix: string | null;
  created_at: Date;
  updated_at: Date | null;
  amount: Decimal
};

export interface CreatePaymentRequestDTO {
  type: TransactionType;
  status: RequestStatus;
  request_by: number;
  request_to: number;
  payment_proof_path?: string;
  invoice: string;
  agent_payment_account_id?: number;
  account_number: string;
  account_name: string;
  payment_gateway_id: number;
  reference_code_suffix?: string;
  amount: Decimal
}

export interface UpdatePaymentRequestDTO {
    id: number;
    status: RequestStatus;
}

export type DepositPaymentRequest = z.infer<typeof depositPaymentRequestSchema>