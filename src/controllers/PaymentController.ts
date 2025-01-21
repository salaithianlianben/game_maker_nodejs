import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import prisma from "../models/prisma";
import { PaymentService } from "../services/payment.service";

export class PaymentController {
  private service: PaymentService = new PaymentService(prisma);

  transfer = async (req: Request, res: Response): Promise<void> => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      res.status(400).json({
        status: "fail",
        message: "Missing or invalid user data",
        errors: [
          "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
        ],
        data: null,
      } as ErrorResponse);
      return;
    }
    try {
      const { beneficiary_id, amount, remark } = req.body;

      const data = await this.service.transfer({
        amount: amount,
        receiver_id: parseInt(beneficiary_id),
        remark: remark,
        sender_id: parseInt(reqData.userId),
      });
      res.status(200).json({
        status: "success",
        message: "Transferred money successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error transfering ( depositing ) money:", error);
      if (error instanceof Error) {
        res.status(500).json({
          status: "fail",
          message: error.message,
          errors: error.stack,
          data: null,
        } as ErrorResponse);
      } else {
        res.status(500).json({
          status: "fail",
          message: "Internal server error",
          errors: ["An unexpected error occurred while transferring money."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  deposit = async (req: Request, res: Response): Promise<void> => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      res.status(400).json({
        status: "fail",
        message: "Missing or invalid user data",
        errors: [
          "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
        ],
        data: null,
      } as ErrorResponse);
      return;
    }
    try {
      const { amount, remark } = req.body;

      const data = await this.service.deposit({
        amount: amount,
        remark: remark,
        deposit_by: parseInt(reqData.userId),
      });
      res.status(200).json({
        status: "success",
        message: "Depositted money successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error depositting money:", error);
      if (error instanceof Error) {
        res.status(500).json({
          status: "fail",
          message: error.message,
          errors: error.stack,
          data: null,
        } as ErrorResponse);
      } else {
        res.status(500).json({
          status: "fail",
          message: "Internal server error",
          errors: ["An unexpected error occurred while depositting money."],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
