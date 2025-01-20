import { PrismaClient } from "@prisma/client";
import { IPaymentRequestRepository } from "./IPaymentRequestRepository";
import {
  CreatePaymentRequestDTO,
  PaymentRequest,
  UpdatePaymentRequestDTO,
} from "../types/payment-request";

export class PaymentRequestRepository implements IPaymentRequestRepository {
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    requestBy: true,
    requestTo: true,
  };

  async create(data: CreatePaymentRequestDTO): Promise<PaymentRequest> {
    return this.prisma.payment_request.create({
      data,
      include: this.includeRelations,
    });
  }

  async update(data: UpdatePaymentRequestDTO): Promise<PaymentRequest> {
    const { id, ...updateData } = data;
    return this.prisma.payment_request.update({
      where: { id },
      data: updateData,
      include: this.includeRelations,
    });
  }

  async delete(id: number): Promise<null> {
    this.prisma.agent_payment_account.delete({
      where: { id },
    });
    return null;
  }

  async findById(id: number): Promise<PaymentRequest | null> {
    return this.prisma.payment_request.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  async findManyByRequestBy(id: number): Promise<PaymentRequest[]> {
    return this.prisma.payment_request.findMany({
      where: { request_by: id },
      include: this.includeRelations,
    });
  }

  async findManyByRequestTo(id: number): Promise<PaymentRequest[]> {
    return this.prisma.payment_request.findMany({
      where: { request_to: id },
      include: this.includeRelations,
    });
  }
}
