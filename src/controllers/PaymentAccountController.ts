import { Request, Response } from "express";
import { PaymentAccountService } from "../services/payment-account.service";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";

export class PaymentAccountController {
  private service: PaymentAccountService;

  constructor(service: PaymentAccountService) {
    this.service = service;
  }

  create = async (req: Request, res: Response): Promise<void> => {
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
      const { account_name, account_number, payment_gateway_id } = req.body;
      const paymentAccount = await this.service.createPaymentAccount({
        account_name: account_name,
        account_number: account_number,
        agent_id: parseInt(reqData.userId),
        payment_gateway_id: parseInt(payment_gateway_id)
      });
      res.status(200).json({
        status: "success",
        message: "Created agent payment account successfully",
        data: paymentAccount,
      } as ApiResponse<typeof paymentAccount>);
    } catch (error) {
      console.error("Error creating agent payment accounts:", error);
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
            "An unexpected error occurred while creating agent payment accounts.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const paymentAccount = await this.service.updatePaymentAccount({
        id: id,
        payment_gateway_id: req.body.payment_gateway_id && parseInt(req.body.payment_gateway_id),
        ...req.body,
      });

      res.status(200).json({
        status: "success",
        message: "Updated agent payment account successfully",
        data: paymentAccount,
      } as ApiResponse<typeof paymentAccount>);
    } catch (error) {
      console.error("Error updating agent payment accounts:", error);
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
            "An unexpected error occurred while updating agent payment accounts.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deletePaymentAccount(id);
      res.status(204).json({
        status: "success",
        message: "Deleted payment account successfully",
        data: null,
      } as ApiResponse<null>);
    } catch (error) {
      console.error("Error deleting agent payment account:", error);
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
            "An unexpected error occurred while deleting agent payment account.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const paymentAccount = await this.service.getPaymentAccountById(id);
      res.status(200).json({
        status: "success",
        message: "Fetch agent payment account successfully",
        data: paymentAccount,
      } as ApiResponse<typeof paymentAccount>);
    } catch (error) {
      console.error("Error fetching agent payment account:", error);
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
            "An unexpected error occurred while fetching agent payment account.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getByAgentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const agentId = parseInt(req.params.agentId);
      const paymentAccounts =
        await this.service.getPaymentAccountsByAgentId(agentId);
      res.status(200).json({
        status: "success",
        message: "Fetch agent payment accounts successfully",
        data: paymentAccounts,
      } as ApiResponse<typeof paymentAccounts>);
    } catch (error) {
      console.error("Error fetching agent payment accounts:", error);
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
            "An unexpected error occurred while fetching agent payment accounts.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
