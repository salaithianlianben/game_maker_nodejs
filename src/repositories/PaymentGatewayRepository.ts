import { PrismaClient } from "@prisma/client";
import { IPaymentGatewayRepository } from "./IPaymentGatewayRepository";
import {
  CreatePaymentGatewayDTO,
  PaymentGateway,
  UpdatePaymentGatewayDTO,
} from "../types/payment-gateway";

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

  create(data: CreatePaymentGatewayDTO): Promise<PaymentGateway | null> {
    return this.prisma.payment_gateway.create({
      data,
    });
  }

  update(
    id: number,
    data: UpdatePaymentGatewayDTO
  ): Promise<PaymentGateway | null> {
    return this.prisma.payment_gateway.update({
      where: { id: id },
      data,
    });
  }
}
