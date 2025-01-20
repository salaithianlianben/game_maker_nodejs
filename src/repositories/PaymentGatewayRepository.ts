import { PrismaClient } from "@prisma/client";
import { IPaymentGatewayRepository } from "./IPaymentGatewayRepository";
import { PaymentGateway } from "../types/payment-gateway";

export class PaymentGatewayRepository implements IPaymentGatewayRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<PaymentGateway | null> {
    return this.prisma.payment_gateway.findUnique({
      where: { id },
    });
  }

  async findMany(): Promise<PaymentGateway[]> {
    return this.prisma.payment_gateway.findMany();
  }
}
