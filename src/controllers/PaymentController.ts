import { Request, Response } from "express";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import prisma from "../models/prisma";
import { PaymentService } from "../services/payment.service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { handleErrorResponse } from "../utils/errors";

export class PaymentController {
  private service: PaymentService = new PaymentService(prisma);

  private getRequestUserData(req: Request): UserPayload | null {
    return get(req, "user", null) as UserPayload | null;
  }

  transfer = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { beneficiary_id, amount, remark } = req.body;

      const data = await this.service.transfer({
        amount: amount,
        receiver_id: parseInt(beneficiary_id),
        remark: remark,
        sender_id: parseInt(user.userId),
      });

      sendSuccessResponse(res, 201, "Transferred money successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  deposit = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { amount, remark } = req.body;

      const data = await this.service.deposit({
        amount: amount,
        remark: remark,
        deposit_by: parseInt(user.userId),
      });

      sendSuccessResponse(res, 201, "Depositted money successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
