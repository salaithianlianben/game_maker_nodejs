import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { AdminService } from "../services/admin.service";
import prisma from "../models/prisma";
import { PaginationQueryParams } from "../types/PaginationQueryParams";
import { sendSuccessResponse } from "../utils/responseHelper";
import { handleErrorResponse } from "../utils/errors";

export class AdminController {
  private service: AdminService = new AdminService(prisma);

  createOwner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, password, phone_number, site_name, site_url } = req.body;

      const filePath = req.file ? `${req.file.path}` : null;

      const data = await this.service.addOwner({
        name: name,
        password: password,
        phone_number: phone_number,
        site_name: site_name,
        site_url: site_url,
        logo_path: filePath ?? "",
      });

      sendSuccessResponse(
        res,
        201,
        "Created owner accouont successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getOwners = async (
    req: Request<{}, {}, {}, PaginationQueryParams>,
    res: Response
  ): Promise<void> => {
    try {
      const page: number = parseInt(req.query.page || "1", 10);
      const size: number = parseInt(req.query.size || "10", 10);
      const query: string = req.query.query || "";
      const data = await this.service.fetchOwners({
        page,
        size,
        query,
      });

      sendSuccessResponse(res, 200, "Retrieving owners successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
