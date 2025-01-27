import { Request, Response } from "express";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import prisma from "../models/prisma";
import { UserService } from "../services/users.service";
import { UsersAccessLogsService } from "../services/users-access-logs.service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { handleErrorResponse } from "../utils/errors";

export class UserController {
  private service: UserService = new UserService(prisma);
  private userLogService: UsersAccessLogsService = new UsersAccessLogsService(
    prisma
  );

  private getRequestUserData(req: Request): UserPayload | null {
    return get(req, "user", null) as UserPayload | null;
  }

  private parseBoolean(value: string | undefined): boolean | undefined {
    return value === undefined ? undefined : value === "true";
  }

  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const data = await this.service.getUserById(parseInt(user.userId));

      sendSuccessResponse(res, 200, "Retrieved profile successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  updateUserInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const { is_active, name } = req.body;

      const data = await this.service.updateUser({
        id: parseInt(id),
        is_active: this.parseBoolean(is_active),
        name: name,
      });

      sendSuccessResponse(res, 200, "Updated account info successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getUserLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.userLogService.getUserLogByUserId(parseInt(id));

      sendSuccessResponse(
        res,
        200,
        "Retrieved user access log successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
