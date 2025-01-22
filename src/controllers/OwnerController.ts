import prisma from "../models/prisma";
import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { get } from "lodash";
import { UserPayload } from "../utils/jwtUtils";
import { OwnerService } from "../services/owner.service";
import { PaginationQueryParams } from "../types/PaginationQueryParams";

export class OwnerController {
  private service: OwnerService = new OwnerService(prisma);

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
      const { name, password, phone_number } = req.body;

      const data = await this.service.addBaseAgent({
        name,
        password,
        phone_number,
        owner_id: parseInt(reqData.userId),
      });

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

  getAgents = async (
    req: Request<{}, {}, {}, PaginationQueryParams>,
    res: Response
  ): Promise<void> => {
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
      const page: number = parseInt(req.query.page || "1", 10);
      const size: number = parseInt(req.query.size || "10", 10);
      const query: string = req.query.query || "";

      const data = await this.service.fetchBasedAgents({
        page,
        size,
        query,
        owner_id: parseInt(reqData.userId),
      });

      res.status(200).json({
        status: "success",
        message: "Retrieving agent data successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error retrieving agent data:", error);
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
            "An unexpected error occurred while retrieving agent data.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
