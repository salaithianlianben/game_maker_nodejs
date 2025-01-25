import prisma from "../models/prisma";
import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import Logger from "../utils/logger";
import { GameCategoryService } from "../services/game-category.service";

export class GameController {
  private gameCategoryService: GameCategoryService = new GameCategoryService(
    prisma
  );

  addGameCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;

      const filePath = req.file ? `${req.file.path}` : null;

      console.info(req.body);

      const data = await this.gameCategoryService.createGameCategory({
        name: name,
        image_path: filePath ? filePath : undefined,
      });

      res.status(201).json({
        status: "success",
        message: "Created new game category successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error creating game category:", error);
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
            "An unexpected error occurred while creating game category.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  updateGameCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, is_active, order_number } = req.body;

      const filePath = req.file ? `${req.file.path}` : null;

      const data = await this.gameCategoryService.updateGameCategory({
        id: parseInt(id),
        name,
        is_active:
          is_active === undefined
            ? undefined
            : is_active === "true"
              ? true
              : false,
        image_path: filePath ? filePath : undefined,
        order_number: order_number ? parseInt(order_number) : order_number,
      });

      res.status(200).json({
        status: "success",
        message: "Updated game category successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error updating game category:", error);
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
            "An unexpected error occurred while updating game category.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getAllGameCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameCategoryService.getAllGameCategories();

      res.status(200).json({
        status: "success",
        message: "Retrieving game category successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game category:", error);
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
            "An unexpected error occurred while retrieving game category.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  // Only active game categories
  getGameCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameCategoryService.getGameCategories();

      res.status(200).json({
        status: "success",
        message: "Retrieving game category successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game category:", error);
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
            "An unexpected error occurred while retrieving game category.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGameCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.gameCategoryService.getGameCategory(parseInt(id));

      res.status(200).json({
        status: "success",
        message: "Retrieving game category successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game category:", error);
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
            "An unexpected error occurred while retrieving game category.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGameCategoryByName = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { name } = req.params;

      const data = await this.gameCategoryService.getGameCategoryByName(name);

      res.status(200).json({
        status: "success",
        message: "Retrieving game category successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game category:", error);
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
            "An unexpected error occurred while retrieving game category.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
