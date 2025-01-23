import prisma from "../models/prisma";
import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { AuthService } from "../services/auth.service";
import Logger from "../utils/logger";
import { User } from "../types/user";

export class AuthController {
  private service: AuthService = new AuthService(prisma);

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { password, name, phone_number, referral_code } = req.body;
      Logger.info(req.body);

      if (!referral_code) {
        res.status(400).json({
          status: "fail",
          message: "referral_code is required for players",
          data: null,
        } as ErrorResponse);
        return;
      }

      const data = await this.service.addPlayer({
        name: name,
        phone_number: phone_number,
        password: password,
        referral_code: referral_code,
      });

      if (data && data.username) {
        const { user, token } = await this.service.loginUser(
          data.username,
          password
        );
        res.status(201).json({
          status: "success",
          message: "User registered and logged in successfully",
          data: { user: user as User, token },
        } as ApiResponse<{ user: User; token: string }>);
        return;
      }

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data,
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

  login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const { user, token } = await this.service.loginUser(username, password);

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: { user: user as User, token },
      } as ApiResponse<{ user: User; token: string }>);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          status: "fail",
          message: error.message,
          errors: error.stack,
          data: null,
        } as ErrorResponse);
      } else
        res.status(500).json({
          status: "fail",
          message: "Internal server error",
          errors: error,
          data: null,
        } as ErrorResponse);
    }
  };
}
