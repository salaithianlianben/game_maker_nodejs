import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { PaymentGatewayService } from "../services/payment-gateway.service";

export class PaymentGatewayController {
  private service: PaymentGatewayService;

  constructor(service: PaymentGatewayService) {
    this.service = service;
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = await this.service.getPaymentGatewayById(id);
      res.status(200).json({
        status: "success",
        message: "Fetch agent payment gateway successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error fetching agent gateway account:", error);
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
            "An unexpected error occurred while fetching agent payment gateway.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getAllPaymentGateway = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAllPaymentGateway();
      res.status(200).json({
        status: "success",
        message: "Fetch agent payment gateway successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error fetching agent payment gateway:", error);
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
            "An unexpected error occurred while fetching agent payment gateway.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
