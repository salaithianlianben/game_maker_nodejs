import { Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";

export const sendSuccessResponse = <T>(
  res: Response,
  status: number,
  message: string,
  data: T
): void => {
  res.status(status).json({
    status: "success",
    message,
    data,
  } as ApiResponse<T>);
};

export const sendErrorResponse = (
  res: Response,
  status: number,
  message: string,
  error?: any
): void => {
  res.status(status).json({
    status: "fail",
    message,
    errors: error ? error.stack || error : undefined,
    data: null,
  } as ErrorResponse);
};
