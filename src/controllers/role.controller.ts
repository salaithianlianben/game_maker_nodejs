import { get } from "lodash";
import { UserPayload } from "../utils/jwtUtils";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { Request, Response } from "express";
import { fetchRoles } from "../services/role.service";

const getRoles = async (req: Request, res: Response): Promise<void> => {
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

    const data = await fetchRoles();

    res.status(200).json({
      status: "success",
      message: "Players list retrieved successfully",
      data: data,
    } as ApiResponse<typeof data>);
  } catch (error) {
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
};

export { getRoles }