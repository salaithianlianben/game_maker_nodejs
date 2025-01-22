import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { PaymentGatewayService } from "../services/payment-gateway.service";
import prisma from "../models/prisma";

export class PaymentGatewayController {
  private service: PaymentGatewayService = new PaymentGatewayService(prisma);

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

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;

      const filePath = req.file ? `${req.file.path}` : "";

      const data = await this.service.createPaymentGateway({
        logo_path: filePath,
        name: name,
      });
      res.status(200).json({
        status: "success",
        message: "Create payment gateway successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error creating payment gateway:", error);
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
            "An unexpected error occurred while creating payment gateway.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const filePath = req.file ? `${req.file.path}` : undefined;

      const data = await this.service.updatePaymentGateway({
        id: parseInt(id),
        logo_path: filePath,
        name: name,
      });
      res.status(200).json({
        status: "success",
        message: "Updated payment gateway successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error updating payment gateway:", error);
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
            "An unexpected error occurred while updating payment gateway.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
