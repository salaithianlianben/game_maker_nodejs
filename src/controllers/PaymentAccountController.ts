import { Request, Response } from "express";
import { PaymentAccountService } from "../services/payment-account.service";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import prisma from "../models/prisma";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { handleErrorResponse } from "../utils/errors";

export class PaymentAccountController {
  private service: PaymentAccountService = new PaymentAccountService(prisma);

  private getRequestUserData(req: Request): UserPayload | null {
    return get(req, "user", null) as UserPayload | null;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { account_name, account_number, payment_gateway_id } = req.body;
      const paymentAccount = await this.service.createPaymentAccount({
        account_name: account_name,
        account_number: account_number,
        agent_id: parseInt(user.userId),
        payment_gateway_id: parseInt(payment_gateway_id),
      });

      sendSuccessResponse(
        res,
        201,
        "Created agent payment account successfully",
        paymentAccount
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const paymentAccount = await this.service.updatePaymentAccount({
        id: id,
        payment_gateway_id:
          req.body.payment_gateway_id && parseInt(req.body.payment_gateway_id),
        ...req.body,
      });

      sendSuccessResponse(
        res,
        200,
        "Updated agent payment account successfully",
        paymentAccount
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deletePaymentAccount(id);

      sendSuccessResponse(
        res,
        204,
        "Deleted payment account successfully",
        null
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const paymentAccount = await this.service.getPaymentAccountById(id);

      sendSuccessResponse(
        res,
        200,
        "Retrieved agent payment account successfully",
        paymentAccount
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getByAgentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const agentId = parseInt(req.params.agentId);
      const paymentAccounts =
        await this.service.getPaymentAccountsByAgentId(agentId);

      sendSuccessResponse(
        res,
        200,
        "Retrieved agent payment account successfully",
        paymentAccounts
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
