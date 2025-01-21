import prisma from "../models/prisma";
import { Request, Response } from "express";
import { AgentService } from "../services/agent.service";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { get } from "lodash";
import { UserPayload } from "../utils/jwtUtils";

export class AgentController {
  private service: AgentService = new AgentService(prisma);

  createAgent = async (req: Request, res: Response): Promise<void> => {
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
      const { name, password, phone_number, referral_code } = req.body;

      let data;

      if (reqData.role !== "agent" && reqData.role !== "owner") {
        throw new Error(
          "Invalid role. Role must be either 'agent' or 'owner'."
        );
      }

      if (reqData.role === "agent") {
        if (!referral_code) {
          throw new Error("Referral code is required for agents.");
        }

        data = await this.service.addAgent({
          name,
          password,
          phone_number,
          referral_code,
        });
      } else if (reqData.role === "owner") {
        if (referral_code) {
          throw new Error(
            "Owners should not provide a referral code. Please remove it."
          );
        }

        data = await this.service.addBaseAgent({
          name,
          password,
          phone_number,
          owner_id: parseInt(reqData.userId),
        });
      }

      res.status(200).json({
        status: "success",
        message: "Created agent account successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error creating agent account:", error);
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
            "An unexpected error occurred while creating agent account.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
