import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import { AdminService } from "../services/admin.service";
import prisma from "../models/prisma";

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
      res.status(200).json({
        status: "success",
        message: "Created owner accouont successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error creating owner account:", error);
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
            "An unexpected error occurred while creating owner account.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getOwners = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.fetchOwners();

      res.status(200).json({
        status: "success",
        message: "Retrieving owners successfully",
        data: data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error fetching owners:", error);
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
            "An unexpected error occurred while fetching owners.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
