import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { UserPayload } from "../utils/jwtUtils";
import { sendErrorResponse } from "../utils/responseHelper";

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      sendErrorResponse(res, 401, "Unauthorized", [
        "Access denied. Please log in and provide a valid token.",
      ]);
      return;
    }

    if (!roles.includes(reqData.role)) {
      sendErrorResponse(res, 403, "Access Denied", [
        `You don't have permission to perform this action. Only users with the ${roles.join(", ")} role can access this resource.`,
      ]);
      return;
    }

    next();
  };
};
