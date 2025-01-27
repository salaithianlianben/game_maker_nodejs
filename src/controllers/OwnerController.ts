import prisma from "../models/prisma";
import { Request, Response } from "express";
import { get } from "lodash";
import { UserPayload } from "../utils/jwtUtils";
import { OwnerService } from "../services/owner.service";
import { PaginationQueryParams } from "../types/PaginationQueryParams";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { handleErrorResponse } from "../utils/errors";

export class OwnerController {
  private service: OwnerService = new OwnerService(prisma);

  private getRequestUserData(
    req: Request | Request<{}, {}, {}, PaginationQueryParams>
  ): UserPayload | null {
    return get(req, "user", null) as UserPayload | null;
  }

  createAgent = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { name, password, phone_number } = req.body;

      const data = await this.service.addBaseAgent({
        name,
        password,
        phone_number,
        owner_id: parseInt(user.userId),
      });

      sendSuccessResponse(res, 201, "Created agent account successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getAgents = async (
    req: Request<{}, {}, {}, PaginationQueryParams>,
    res: Response
  ): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
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
        owner_id: parseInt(user.userId),
      });

      sendSuccessResponse(res, 200, "Retrieving agent data successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
