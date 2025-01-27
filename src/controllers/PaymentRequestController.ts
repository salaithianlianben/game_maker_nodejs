import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import { PaymentRequestService } from "../services/payment-request.service";
import { RequestStatus } from "@prisma/client";
import prisma from "../models/prisma";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { handleErrorResponse } from "../utils/errors";

export class PaymentRequestController {
  private service: PaymentRequestService = new PaymentRequestService(prisma);

  private getRequestUserData(req: Request): UserPayload | null {
    return get(req, "user", null) as UserPayload | null;
  }

  deposit = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    const filePath = req.file ? `${req.file.path}` : null;

    try {
      const { agent_payment_account_id, reference_code_suffix, amount } =
        req.body;

      const depositRequest = await this.service.createDepositPaymentRequest({
        request_by: parseInt(user.userId),
        agent_payment_account_id: parseInt(agent_payment_account_id),
        payment_proof_path: filePath ?? "",
        reference_code_suffix: reference_code_suffix,
        amount: amount,
      });

      sendSuccessResponse(
        res,
        200,
        "Submitted deposit request successfully",
        depositRequest
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getPaymentHistories = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const data = await this.service.getPaymentRequestHistories({
        request_by: parseInt(user.userId),
        role: user.role,
      });
      res.status(200).json({
        status: "success",
        message: "Retrieving payment request histories successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getPaymentRequest = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    const { id } = req.params;

    try {
      const data = await this.service.getPaymentRequest(parseInt(id));

      if (!data) throw new Error("Payment request is not found.");

      if (user.role === "agent" && user.userId !== data.request_to?.toString())
        throw new Error(
          "You don't have access to retrieve the payment request"
        );
      if (user.role === "player" && user.userId !== data.request_by?.toString())
        throw new Error(
          "You don't have access to retrieve the payment request"
        );

      res.status(200).json({
        status: "success",
        message: "Retrieving payment request successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  withdraw = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { payment_gateway_id, account_name, amount, account_number } =
        req.body;

      const withdrawRequest = await this.service.createWithdrawPaymentRequest({
        request_by: parseInt(user.userId),
        payment_gateway_id: parseInt(payment_gateway_id),
        account_name: account_name,
        account_number: account_number,
        amount: amount,
      });

      sendSuccessResponse(
        res,
        200,
        "Submitted withdraw request successfully",
        withdrawRequest
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatePaymentRequest = await this.service.updatePaymentRequest({
        id: parseInt(id),
        status: status as RequestStatus,
      });

      sendSuccessResponse(
        res,
        200,
        "Updated paymenet request successfully",
        updatePaymentRequest
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
