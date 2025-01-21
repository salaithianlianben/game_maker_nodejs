import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";
import prisma from "../models/prisma";
import { UserService } from "../services/users.service";

export class UserController {
  private service: UserService = new UserService(prisma);

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
}
