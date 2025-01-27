import { Response } from "express";
import Logger from "./logger";
import { sendErrorResponse } from "./responseHelper";

export const handleErrorResponse = (error: any, res: Response): void => {
  Logger.error("Error occurred:", error);

  if (error instanceof Error) {
    sendErrorResponse(res, 500, error.message, error.stack);
  } else {
    sendErrorResponse(res, 500, "Internal server error", [
      "An unexpected error occurred.",
    ]);
  }
};
