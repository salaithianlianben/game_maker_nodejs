import prisma from "../models/prisma";
import { Request, Response } from "express";
import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
import Logger from "../utils/logger";
import { GameCategoryService } from "../services/game-category.service";
import { GameProviderService } from "../services/game-provider.service";
import {
  addGameProviderSchema,
  updateGameProviderSchema,
} from "../schema/game-provider.schema";
import { createGameSchema, updateGameSchema } from "../schema/game.schema";
import { GameService } from "../services/game.service";
import { UserPayload } from "../utils/jwtUtils";
import { get } from "lodash";

export class GameController {
  private gameCategoryService: GameCategoryService = new GameCategoryService(
    prisma
  );
  private gameProviderService: GameProviderService = new GameProviderService(
    prisma
  );
  private gameService: GameService = new GameService(prisma);

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

  addGameProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, game_category_id } = await addGameProviderSchema.parseAsync(
        req.body
      );

      const data = await this.gameProviderService.addGameProvider({
        name: name,
        game_category_id: game_category_id,
      });

      res.status(201).json({
        status: "success",
        message: "Created new game provider successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error creating game provider:", error);
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
            "An unexpected error occurred while creating game provider.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  // Only active game providers
  getGameProviders = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameProviderService.fetchGameProviders();

      res.status(200).json({
        status: "success",
        message: "Retrieving game provider successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game provider:", error);
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
            "An unexpected error occurred while retrieving game provider.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGameProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.gameProviderService.fetchGameProvider(
        parseInt(id)
      );

      res.status(200).json({
        status: "success",
        message: "Retrieving game provider successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game provider:", error);
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
            "An unexpected error occurred while retrieving game provider.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getAllGameProviders = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameProviderService.fetchAllGameProviders();

      res.status(200).json({
        status: "success",
        message: "Retrieving game provider successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game provider:", error);
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
            "An unexpected error occurred while retrieving game provider.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  updateGameProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const { name, is_active, order_number, game_category_id } =
        await updateGameProviderSchema.parseAsync(req.body);

      const data = await this.gameProviderService.updateGameProvider({
        id: parseInt(id),
        name,
        is_active,
        game_category_id,
        order_number: order_number,
      });

      res.status(200).json({
        status: "success",
        message: "Updated game provider successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error updating game provider:", error);
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
            "An unexpected error occurred while updating game provider.",
          ],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  createGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, game_category_id, code, game_provider_id } =
        await createGameSchema.parseAsync(req.body);

      const filePath = req.file ? `${req.file.path}` : undefined;

      if (!filePath) throw new Error("image_path is required.");

      const data = await this.gameService.addGame({
        name: name,
        game_category_id: game_category_id,
        game_provider_id: game_provider_id,
        code: code,
        image_path: filePath,
      });

      res.status(201).json({
        status: "success",
        message: "Created new game successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error creating game:", error);
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
          errors: ["An unexpected error occurred while creating game."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  updateGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const { name, is_active, game_category_id, game_provider_id, code } =
        await updateGameSchema.parseAsync(req.body);

      const filePath = req.file ? `${req.file.path}` : undefined;

      const data = await this.gameService.updateGame({
        id: parseInt(id),
        name,
        is_active,
        game_category_id,
        game_provider_id,
        code,
        image_path: filePath,
      });

      res.status(200).json({
        status: "success",
        message: "Updated game successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error updating game:", error);
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
          errors: ["An unexpected error occurred while updating game."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGames = async (req: Request, res: Response): Promise<void> => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      res.status(400).json({
        status: "fail",
        message: "Missing or invalid user data",
        errors: [
          "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
        ],
        data: null,
      } as ErrorResponse);
      return;
    }

    try {
      const data =
        reqData.role === "super_admin"
          ? await this.gameService.fetchAllGames()
          : await this.gameService.fetchGames();

      res.status(200).json({
        status: "success",
        message: "Retrieving game successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game:", error);
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
          errors: ["An unexpected error occurred while retrieving game."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.gameService.fetchGameDetail(parseInt(id));

      res.status(200).json({
        status: "success",
        message: "Retrieving game successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game:", error);
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
          errors: ["An unexpected error occurred while retrieving game."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGameByProviderId = async (req: Request, res: Response): Promise<void> => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      res.status(400).json({
        status: "fail",
        message: "Missing or invalid user data",
        errors: [
          "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
        ],
        data: null,
      } as ErrorResponse);
      return;
    }
    try {
      const { id } = req.params;

      const data =
        reqData.role === "super_admin"
          ? await this.gameService.fetchAllGameByGameProviderId(parseInt(id))
          : await this.gameService.fetchGameByGameProviderId(parseInt(id));

      res.status(200).json({
        status: "success",
        message: "Retrieving game successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game:", error);
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
          errors: ["An unexpected error occurred while retrieving game."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGameByCategoryId = async (req: Request, res: Response): Promise<void> => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      res.status(400).json({
        status: "fail",
        message: "Missing or invalid user data",
        errors: [
          "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
        ],
        data: null,
      } as ErrorResponse);
      return;
    }
    try {
      const { id } = req.params;

      const data =
        reqData.role === "super_admin"
          ? await this.gameService.fetchAllGameByGameCategoryId(parseInt(id))
          : await this.gameService.fetchGameByGameCategoryId(parseInt(id));

      res.status(200).json({
        status: "success",
        message: "Retrieving game successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game:", error);
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
          errors: ["An unexpected error occurred while retrieving game."],
          data: null,
        } as ErrorResponse);
      }
    }
  };

  getGameByGameCategoryAndProviderId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const reqData = get(req, "user", null) as UserPayload | null;

    if (!reqData) {
      res.status(400).json({
        status: "fail",
        message: "Missing or invalid user data",
        errors: [
          "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
        ],
        data: null,
      } as ErrorResponse);
      return;
    }
    try {
      const { provider_id, category_id } = req.params;

      const data =
        reqData.role === "super_admin"
          ? await this.gameService.fetchAllGameByGameCategoryAndProviderId({
              game_category_id: parseInt(category_id),
              game_provider_id: parseInt(provider_id),
            })
          : await this.gameService.fetchGameByGameCategoryAndProviderId({
              game_category_id: parseInt(category_id),
              game_provider_id: parseInt(provider_id),
            });

      res.status(200).json({
        status: "success",
        message: "Retrieving game successfully",
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      Logger.error("Error retrieving game:", error);
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
          errors: ["An unexpected error occurred while retrieving game."],
          data: null,
        } as ErrorResponse);
      }
    }
  };
}
