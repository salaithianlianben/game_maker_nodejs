import prisma from "../models/prisma";
import { Request, Response } from "express";
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
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { handleErrorResponse } from "../utils/errors";

export class GameController {
  private gameCategoryService: GameCategoryService = new GameCategoryService(
    prisma
  );
  private gameProviderService: GameProviderService = new GameProviderService(
    prisma
  );
  private gameService: GameService = new GameService(prisma);

  private getRequestUserData(req: Request): UserPayload | null {
    return get(req, "user", null) as UserPayload | null;
  }

  private parseBoolean(value: string | undefined): boolean | undefined {
    return value === undefined ? undefined : value === "true";
  }

  addGameCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;

      const filePath = req.file ? `${req.file.path}` : null;

      const data = await this.gameCategoryService.createGameCategory({
        name: name,
        image_path: filePath ?? undefined,
      });

      sendSuccessResponse(
        res,
        201,
        "Created new game category successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
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
        is_active: this.parseBoolean(is_active),
        image_path: filePath ? filePath : undefined,
        order_number: order_number ? parseInt(order_number) : undefined,
      });

      sendSuccessResponse(res, 200, "Updated game category successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getAllGameCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameCategoryService.getAllGameCategories();

      sendSuccessResponse(
        res,
        200,
        "Retrieving game category successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  // Only active game categories
  getGameCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameCategoryService.getGameCategories();

      sendSuccessResponse(
        res,
        200,
        "Retrieving game category successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGameCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.gameCategoryService.getGameCategory(parseInt(id));

      sendSuccessResponse(
        res,
        200,
        "Retrieving game category successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGameCategoryByName = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { name } = req.params;

      const data = await this.gameCategoryService.getGameCategoryByName(name);

      sendSuccessResponse(
        res,
        200,
        "Retrieving game category successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
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

      sendSuccessResponse(
        res,
        201,
        "Created new game provider successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  // Only active game providers
  getGameProviders = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameProviderService.fetchGameProviders();

      sendSuccessResponse(
        res,
        200,
        "Retrieving game provider successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGameProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.gameProviderService.fetchGameProvider(
        parseInt(id)
      );

      sendSuccessResponse(
        res,
        200,
        "Retrieving game provider successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getAllGameProviders = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.gameProviderService.fetchAllGameProviders();

      sendSuccessResponse(
        res,
        200,
        "Retrieving game provider successfully",
        data
      );
    } catch (error) {
      handleErrorResponse(error, res);
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

      sendSuccessResponse(res, 200, "Updated game provider successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  createGame = async (req: Request, res: Response): Promise<void> => {
    
    try {
      const { name, game_category_id, code, game_provider_id, image_path } =
        await createGameSchema.parseAsync(req.body);

      const filePath = req.file ? `${req.file.path}` : image_path;

      if (!filePath) throw new Error("image_path is required.");

      const data = await this.gameService.addGame({
        name: name,
        game_category_id: game_category_id,
        game_provider_id: game_provider_id,
        code: code,
        image_path: filePath,
      });

      sendSuccessResponse(res, 201, "Created new game successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
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

      sendSuccessResponse(res, 200, "Updated game successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGames = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const data =
        user.role === "super_admin"
          ? await this.gameService.fetchAllGames()
          : await this.gameService.fetchGames();

      sendSuccessResponse(res, 200, "Retrieving game successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await this.gameService.fetchGameDetail(parseInt(id));

      sendSuccessResponse(res, 200, "Retrieving game successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGameByProviderId = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { id } = req.params;

      const data =
        user.role === "super_admin"
          ? await this.gameService.fetchAllGameByGameProviderId(parseInt(id))
          : await this.gameService.fetchGameByGameProviderId(parseInt(id));

      sendSuccessResponse(res, 200, "Retrieving game successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGameByCategoryId = async (req: Request, res: Response): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { id } = req.params;

      const data =
        user.role === "super_admin"
          ? await this.gameService.fetchAllGameByGameCategoryId(parseInt(id))
          : await this.gameService.fetchGameByGameCategoryId(parseInt(id));

      sendSuccessResponse(res, 200, "Retrieving game successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  getGameByGameCategoryAndProviderId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = this.getRequestUserData(req);

    if (!user) {
      sendErrorResponse(res, 400, "Missing or invalid user data", [
        "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
      ]);
      return;
    }

    try {
      const { provider_id, category_id } = req.params;

      const data =
        user.role === "super_admin"
          ? await this.gameService.fetchAllGameByGameCategoryAndProviderId({
              game_category_id: parseInt(category_id),
              game_provider_id: parseInt(provider_id),
            })
          : await this.gameService.fetchGameByGameCategoryAndProviderId({
              game_category_id: parseInt(category_id),
              game_provider_id: parseInt(provider_id),
            });

      sendSuccessResponse(res, 200, "Retrieving game successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
