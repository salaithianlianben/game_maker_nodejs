import { PrismaClient } from "@prisma/client";
import { IPaymentGatewayRepository } from "../repositories/IPaymentGatewayRepository";
import { PaymentGatewayRepository } from "../repositories/PaymentGatewayRepository";
import { PaymentGateway } from "../types/payment-gateway";
import Logger from "../utils/logger";
import { removeFile } from "../utils/common";

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
      Logger.error(
        "Payment Gateway Service (getPaymentGatewayById) => " + error
      );
      throw new Error(
        `Service error fetching payment gateway: ${error.message}`
      );
    }
  }

  async getAllPaymentGateway(): Promise<PaymentGateway[]> {
    try {
      return await this.repository.findMany();
    } catch (error: any) {
      Logger.error(
        "Payment Gateway Service (getAllPaymentGateway) => " + error
      );
      throw new Error(
        `Service error fetching agent payment gateway: ${error.message}`
      );
    }
  }

  createPaymentGateway = async ({
    name,
    logo_path,
  }: {
    name: string;
    logo_path: string;
  }): Promise<PaymentGateway | null> => {
    try {
      return await this.repository.create({
        name,
        logo_path,
      });
    } catch (error: any) {
      Logger.error(
        "Payment Gateway Service (createPaymentGateway) => " + error
      );
      throw new Error(`${error.message}`);
    }
  };

  updatePaymentGateway = async ({
    id,
    name,
    logo_path,
  }: {
    id: number;
    name?: string;
    logo_path?: string;
  }): Promise<PaymentGateway | null> => {
    try {
      const data = await this.repository.findById(id);

      if(!data) throw new Error("Can't get payment gateway info");
      if(logo_path && data.logo_path){
        await removeFile(data.logo_path);
      }
      return await this.repository.update(id, {
        name,
        logo_path,
      });
    } catch (error: any) {
      Logger.error(
        "Payment Gateway Service (updatePaymentGateway) => " + error
      );
      throw new Error(`${error.message}`);
    }
  };
}
