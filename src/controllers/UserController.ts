import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import prisma from "../models/prisma";
import { UserService } from "../services/users.service";
import { UsersAccessLogsService } from "../services/users-access-logs.service";

export class UserController {
  private service: UserService = new UserService(prisma);
  private userLogService: UsersAccessLogsService = new UsersAccessLogsService(
    prisma
  );

  getMe = async (req: Request, res: Response): Promise<void> => {
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
      const data = await this.service.getUserById(parseInt(reqData.userId));

      res.status(200).json({
        status: "success",
        message: "Retrieved profile successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error retrieving profile:", error);
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
          errors: ["An unexpected error occurred while retrieving profile."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  updateUserInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const { is_active, name } = req.body;

      const data = await this.service.updateUser({
        id: parseInt(id),
        is_active: is_active
          ? is_active === "false"
            ? false
            : is_active === "true"
              ? true
              : undefined
          : undefined,
        name: name,
      });

      res.status(200).json({
        status: "success",
        message: "Updated account info successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error updating account info:", error);
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
          errors: ["An unexpected error occurred while updating account info."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  createUserLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, ip_address } = req.body;

      const data = await this.userLogService.createUserLogs({
        user_id: parseInt(user_id),
        ip_address: ip_address,
      });

      res.status(200).json({
        status: "success",
        message: "Created user access log successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error creating user access log:", error);
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
            "An unexpected error occurred while creating user access log.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getUserLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.userLogService.getUserLogByUserId(parseInt(id));

      res.status(200).json({
        status: "success",
        message: "Retrieved user access log successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error retrieving user access log:", error);
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
            "An unexpected error occurred while retrieving user access log.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
