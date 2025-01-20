import { ZodSchema } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ErrorResponse } from "../types/ApiResponse";

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

        res.status(400).json({
          status: "fail",
          message: "Validation failed",
          errors: validationErrors,
          data: null
        } as ErrorResponse);
      } else {
        res.status(500).json({
          status: "fail",
          message: "An unexpected error occurred",
          data: null
        } as ErrorResponse);
      }
    }
  };
