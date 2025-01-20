import { PrismaClient, RequestStatus, TransactionType } from "@prisma/client";
import { PaymentRequest } from "../types/payment-request";
import { IPaymentRequestRepository } from "../repositories/IPaymentRequestRepository";
import { PaymentRequestRepository } from "../repositories/PaymentRequesetRepository";
import { generateSecureInvoiceNumber } from "../utils/common";
import { PaymentAccountService } from "./payment-account.service";
import { UserService } from "./users.serive";
import { Decimal } from "@prisma/client/runtime/library";

export class PaymentRequestService {
  private repository: IPaymentRequestRepository;
  private paymentAccountService: PaymentAccountService;
  private userService: UserService;

  constructor(prisma: PrismaClient) {
    this.repository = new PaymentRequestRepository(prisma);
    this.paymentAccountService = new PaymentAccountService(prisma);
    this.userService = new UserService(prisma);
  }

  async createDepositPaymentRequest({
    request_by,
    payment_proof_path,
    reference_code_suffix,
    agent_payment_account_id,
    amount,
  }: {
    request_by: number;
    payment_proof_path: string;
    agent_payment_account_id: number;
    reference_code_suffix: string;
    amount: Decimal;
  }): Promise<PaymentRequest> {
    try {
      // get agent payment account information
      const agent_payment_account_info =
        await this.paymentAccountService.getPaymentAccountById(
          agent_payment_account_id
        );
      if (!agent_payment_account_info)
        throw new Error(
          `Can not get agent payment account information ${agent_payment_account_id}`
        );

      // get last payment request for to generate unique value of invoce number
      let invoiceValue;
      const lastPaymentRequest = await this.repository.findLast();

      // get invoice unique value
      if (!lastPaymentRequest)
        invoiceValue = generateSecureInvoiceNumber((1).toString());
      else
        invoiceValue = generateSecureInvoiceNumber(
          (lastPaymentRequest.id + 1).toString()
        );

      // get request by data cause need to get request to => agent id
      const userInfo = await this.userService.getUserById(request_by);
      if (!userInfo || !userInfo.parent_id)
        throw new Error(`Can not get user data by ${request_by}`);

      return await this.repository.create({
        account_name: agent_payment_account_info?.account_name,
        account_number: agent_payment_account_info?.account_number,
        payment_gateway_id: agent_payment_account_info.payment_gateway_id,
        request_by: request_by,
        request_to: userInfo.parent_id,
        status: RequestStatus.PENDING,
        type: TransactionType.DEPOSIT,
        agent_payment_account_id: agent_payment_account_info.id,
        payment_proof_path: payment_proof_path,
        reference_code_suffix: reference_code_suffix,
        invoice: invoiceValue,
        amount: amount,
      });
    } catch (error: any) {
      throw new Error(`Error at submiting deposit request ${error.message}`);
    }
  }

  async getPaymentRequestHistories({
    role,
    request_by,
  }: {
    role: string;
    request_by: number;
  }): Promise<PaymentRequest[]> {
    try {
      if (role === "agent") {
        return await this.repository.findManyByRequestTo(request_by);
      } else {
        if (role === "player") {
          return await this.repository.findManyByRequestBy(request_by);
        }
      }
      return [];
    } catch (error: any) {
      throw new Error(
        `Error at fetching payment request histories ${error.message}`
      );
    }
  }

  async getPaymentRequest(id: number): Promise<PaymentRequest | null> {
    try {
      return await this.repository.findById(id);
    } catch (error: any) {
      throw new Error(`Error at fetching payment request ${error.message}`);
    }
  }
}
