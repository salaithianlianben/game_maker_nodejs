import { PrismaClient } from "@prisma/client";
import { IPaymentGatewayRepository } from "../repositories/IPaymentGatewayRepository";
import { PaymentGatewayRepository } from "../repositories/PaymentGatewayRepository";
import { PaymentGateway } from "../types/payment-gateway";

export class PaymentGatewayService {
  private repository: IPaymentGatewayRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new PaymentGatewayRepository(prisma);
  }

  async getPaymentGatewayById(id: number): Promise<PaymentGateway> {
    try {
      const account = await this.repository.findById(id);
      if (!account) {
        throw new Error("Payment gateway not found");
      }
      return account;
    } catch (error: any) {
      throw new Error(
        `Service error fetching payment gateway: ${error.message}`
      );
    }
  }

  async getAllPaymentGateway(): Promise<PaymentGateway[]> {
    try {
      return await this.repository.findMany();
    } catch (error: any) {
      throw new Error(
        `Service error fetching agent payment gateway: ${error.message}`
      );
    }
  }
}
