import { RequestStatus, TransactionType } from "@prisma/client";
import { User } from "./user";
import { PaymentGateway } from "./payment-gateway";

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
}

export interface UpdatePaymentRequestDTO {
    id: number;
    status: RequestStatus;
}
