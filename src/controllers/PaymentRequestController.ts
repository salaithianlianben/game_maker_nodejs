import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import { PaymentRequestService } from "../services/payment-request.service";
import { DepositPaymentRequest } from "../types/payment-request";

export class PaymentRequestController {
  private service: PaymentRequestService;

  constructor(service: PaymentRequestService) {
    this.service = service;
  }

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

    const filePath = req.file ? `${req.file.path}` : null;

    try {
      const { agent_payment_account_id, reference_code_suffix, amount } =
        req.body;

      const depositRequest = await this.service.createDepositPaymentRequest({
        request_by: parseInt(reqData.userId),
        agent_payment_account_id: parseInt(agent_payment_account_id),
        payment_proof_path: filePath ?? "",
        reference_code_suffix: reference_code_suffix,
        amount: amount,
      });
      res.status(200).json({
        status: "success",
        message: "Submitted deposit request successfully",
        data: depositRequest,
      } as ApiResponse<typeof depositRequest>);
    } catch (error) {
      console.error("Error submitting deposit request:", error);
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
          errors: [
            "An unexpected error occurred while submitting deposit request.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getPaymentHistories = async (req: Request, res: Response): Promise<void> => {
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
      const data = await this.service.getPaymentRequestHistories({
        request_by: parseInt(reqData.userId),
        role: reqData.role,
      });
      res.status(200).json({
        status: "success",
        message: "Retrieving payment request histories successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error at fetching payment request histories:", error);
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
          errors: [
            "An unexpected error occurred while fetching payment request histories.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getPaymentRequest = async (req: Request, res: Response): Promise<void> => {
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

    const { id } = req.params;

    try {
      const data = await this.service.getPaymentRequest(parseInt(id));

      if (!data) throw new Error("Payment request is not found.");

      if (
        reqData.role === "agent" &&
        reqData.userId !== data.request_to?.toString()
      )
        throw new Error(
          "You don't have access to retrieve the payment request"
        );
      if (
        reqData.role === "player" &&
        reqData.userId !== data.request_by?.toString()
      )
        throw new Error(
          "You don't have access to retrieve the payment request"
        );
      res.status(200).json({
        status: "success",
        message: "Retrieving payment request successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error at fetching payment request:", error);
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
          errors: [
            "An unexpected error occurred while fetching payment request.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
