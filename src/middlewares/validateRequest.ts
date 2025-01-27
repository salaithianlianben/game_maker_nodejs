import { ZodSchema } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ErrorResponse } from "../types/ApiResponse";
import { sendErrorResponse } from "../utils/responseHelper";

export const validateRequest =
  (schema: ZodSchema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationErrors = error.errors.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        sendErrorResponse(res, 400, "Validation failed", validationErrors);
      } else {
        sendErrorResponse(res, 400, "An unexpected error occurred");
      }
    }
  };
