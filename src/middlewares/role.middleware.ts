import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { UserPayload } from "../utils/jwtUtils";

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized",
        errors: [
          "Please log in to access this resource. Ensure your request includes valid user data.",
        ],
        data: null,
      });
      return;
    }

    if (!roles.includes(reqData.role)) {
      res.status(403).json({
        status: "fail",
        message: "Access Denied",
        errors: [
          `You don't have permission to perform this action. Only users with the ${roles.join(", ")} role can access this resource.`,
        ],
        data: null,
      });
      return;
    }

    next();
  };
};
