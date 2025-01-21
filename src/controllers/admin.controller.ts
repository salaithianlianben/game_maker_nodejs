import { Request, Response } from "express";
import { z } from "zod";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { get } from "lodash";
import { UserPayload } from "../utils/jwtUtils";
import {
  addAgent,
  addBaseAgent,
  fetchAllAgents,
  fetchPlayersOfAgent,
  isUsernameOrPhoneTaken,
} from "../services/user.service";
import { NewOwnerInput } from "../schema/auth.schema";
import { getRoleByName } from "../models/user.model";

const getAllAgents = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const data = await fetchAllAgents({
      id: parseInt(reqData.userId),
      roleName: reqData.role,
    });

    res.status(200).json({
      status: "success",
      message: "Agent list retrieved successfully",
      data: data,
    } as ApiResponse<typeof data>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
        data: null,
      } as ErrorResponse);
    } else {
      console.error("Error fetching agents:", error);
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
            "An unexpected error occurred while retrieving the agents list.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  }
};

const getPlayersOfAgent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

    const data = await fetchPlayersOfAgent(parseInt(reqData.userId));

    res.status(200).json({
      status: "success",
      message: "Players list retrieved successfully",
      data: data,
    } as ApiResponse<typeof data>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
        data: null,
      } as ErrorResponse);
    } else {
      console.error("Error fetching players:", error);
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
            "An unexpected error occurred while retrieving the players list.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  }
};

const createAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, phone_number, referral_code } = req.body;

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

    if (await isUsernameOrPhoneTaken({ phone_number: phone_number })) {
      res.status(400).json({
        status: "fail",
        message: "Phone number is already taken",
        data: null,
      } as ErrorResponse);
      return;
    }

    const role = await getRoleByName("agent");

    if (!role) throw new Error("Fail at fetching agent role ");

    let data;

    if (!referral_code && reqData.role === "owner") {
      data = await addBaseAgent({
        name: name,
        owner_id: parseInt(reqData.userId),
        password: password,
        phone_number: phone_number,
      });
    } else {
      if (referral_code && reqData.role === "agent") {
        data = await addAgent({
          name: name,
          password: password,
          phone_number: phone_number,
          referral_code: referral_code,
          role_id: role.id,
        });
      } else {
        throw new Error(
          "The request payload is not correct. if the auth user is agent, referral code must be passed."
        );
      }
    }
    res.status(200).json({
      status: "success",
      message: "Created agent account successfully",
      data: data,
    } as ApiResponse<typeof data>);
  } catch (error) {
    console.error(error);
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
        errors: ["An unexpected error occurred while creating agent account"],
        data: null,
      } as ErrorResponse);
    }
  }
};

export {
  getAllAgents,
  getPlayersOfAgent,
  createAgent,
};
