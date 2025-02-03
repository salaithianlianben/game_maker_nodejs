import { Request, Response } from "express";
import { PaymentGatewayService } from "../services/payment-gateway.service";
import prisma from "../models/prisma";
import { handleErrorResponse } from "../utils/errors";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseHelper";

export class PaymentGatewayController {
  private service: PaymentGatewayService = new PaymentGatewayService(prisma);

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = await this.service.getPaymentGatewayById(id);

      sendSuccessResponse(
        res,
        200,
        "Retrieved agent payment gateway successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getAllPaymentGateway = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAllPaymentGateway();

      sendSuccessResponse(
        res,
        200,
        "Retrieved agent payment gateway successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {

      const { name } = req.body;

      const filePath = req.file ? `${req.file.path}` : "";

      if(filePath === "") sendErrorResponse(res, 400, "logo_path is required", null);

      const data = await this.service.createPaymentGateway({
        logo_path: filePath,
        name: name,
      });

      sendSuccessResponse(
        res,
        201,
        "Created agent payment gateway successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
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

      sendSuccessResponse(
        res,
        200,
        "Updated agent payment gateway successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
