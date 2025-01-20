import { Request, Response } from "express";
import { z } from "zod";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { User } from "../types/user";
import { addPlayer, isUsernameOrPhoneTaken } from "../services/user.service";
import { loginUser } from "../services/auth.service";
import Logger from "../utils/logger";
import { getRoleByNameFromDB } from "../models/role.model";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, name, phone_number, referral_code } = req.body;

    Logger.info(req.body);
    if (await isUsernameOrPhoneTaken({ phone_number })) {
      res.status(400).json({
        status: "fail",
        message: "Phone number is already taken",
        data: null,
      } as ErrorResponse);
      return;
    }

    const role = await getRoleByNameFromDB("player");

    if (!role) {
      res.status(400).json({
        status: "fail",
        message: "Role not found",
        data: null,
      } as ErrorResponse);
      return;
    }

    if (!referral_code) {
      res.status(400).json({
        status: "fail",
        message: "referral_code is required for players",
        data: null,
      } as ErrorResponse);
      return;
    }

    const data = await addPlayer({
      name: name,
      phone_number: phone_number,
      password: password,
      role_id: role.id,
      referral_code: referral_code,
    });

    if (data && data.username) {
      const { user, token } = await loginUser(data.username, password);
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
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
        data: null,
      } as ErrorResponse);
    } else if (error instanceof Error) {
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
        errors: error,
        data: null,
      } as ErrorResponse);
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const { user, token } = await loginUser(username, password);

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
