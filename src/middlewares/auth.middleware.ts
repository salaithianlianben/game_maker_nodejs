import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/authConfig";
import Logger from "../utils/logger";
import { sendErrorResponse } from "../utils/responseHelper";

export const authenticateJWT: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    sendErrorResponse(res, 401, "Unauthorized", [
      "Access denied. Please log in and provide a valid token.",
    ]);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    (req as any).user = decoded;
    next();
  } catch (error) {
    sendErrorResponse(res, 403, "Invalid or expired token", [
      "The provided token is invalid or has expired. Please log in again to continue.",
    ]);
  }
};
