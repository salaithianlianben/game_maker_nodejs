import { Request, Response } from "express";
import { handleErrorResponse } from "../utils/errors";
import { sendSuccessResponse } from "../utils/responseHelper";
import { RoleService } from "../services/role.service";
import prisma from "../models/prisma";

export class RoleController {
  private service: RoleService = new RoleService(prisma);

  getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.fetchRoles();

      sendSuccessResponse(
        res,
        200,
        "Players list retrieved successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
