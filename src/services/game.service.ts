import { PrismaClient } from "@prisma/client";
import { GameRepository } from "../repositories/GameRepository";
import { string } from "zod";
import { Game } from "../types/game";
import Logger from "../utils/logger";
import { removeFile } from "../utils/common"

export class GameService {
  private repository: GameRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new GameRepository(prisma);
  }

  addGame = async ({
    name,
    code,
    game_provider_id,
    game_category_id,
    image_path,
  }: {
    name: string;
    code: string;
    game_provider_id: number;
    game_category_id: number;
    image_path: string;
  }): Promise<Game> => {
    try {
      return this.repository.create({
        code,
        name,
        game_category_id,
        game_provider_id,
        image_path,
      });
    } catch (error: any) {
      Logger.error(`Service error at ( addGame ) => ${error}`);
      throw new Error(error.message);
    }
  };

  updateGame = async ({
    id,
    name,
    code,
    image_path,
    game_category_id,
    game_provider_id,
    is_active,
  }: {
    id: number;
    name?: string;
    code?: string;
    image_path?: string;
    game_category_id?: number;
    game_provider_id?: number;
    is_active?: boolean;
  }): Promise<Game | null> => {
    try {
      const data = await this.repository.findById(id);
      if (!data) throw new Error("Game doesn't exist.");

      if (image_path) {
        await removeFile(data.image_path);
      }
      return this.repository.update(id, {
        code,
        name,
        image_path,
        game_category_id,
        game_provider_id,
        is_active,
      });
    } catch (error: any) {
      Logger.error(`Service error at ( updateGame ) => ${error}`);
      throw new Error(error.message);
    }
  };

  fetchAllGames = async (): Promise<Game[] | []> => {
    try {
      return this.repository.findAll();
    } catch (error: any) {
      Logger.error(`Service error at ( fetchAllGames ) => ${error}`);
      throw new Error(error.message);
    }
  };

  // only active games
  fetchGames = async (): Promise<Game[] | []> => {
    try {
      return this.repository.findMany();
    } catch (error: any) {
      Logger.error(`Service error at ( fetchGames ) => ${error}`);
      throw new Error(error.message);
    }
  };

  fetchGameDetail = async (id: number): Promise<Game | null> => {
    try {
      return this.repository.findById(id);
    } catch (error: any) {
      Logger.error(`Service error at ( fetchGameDetail ) => ${error}`);
      throw new Error(error.message);
    }
  };

  fetchGameByGameProviderId = async (
    game_provider_id: number
  ): Promise<Game[] | []> => {
    try {
      return this.repository.findManyByProviderId(game_provider_id);
    } catch (error: any) {
      Logger.error(
        `Service error at ( fetchGameByGameProviderId ) => ${error}`
      );
      throw new Error(error.message);
    }
  };

  fetchGameByGameCategoryId = async (
    game_category_id: number
  ): Promise<Game[] | []> => {
    try {
      return this.repository.findManyByCategoryId(game_category_id);
    } catch (error: any) {
      Logger.error(
        `Service error at ( fetchGameByGameCategoryId ) => ${error}`
      );
      throw new Error(error.message);
    }
  };

  fetchGameByGameCategoryAndProviderId = async ({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<Game[] | []> => {
    try {
      return this.repository.findManyByProviderAndCategoryId({
        game_category_id,
        game_provider_id,
      });
    } catch (error: any) {
      Logger.error(
        `Service error at ( fetchGameByGameCategoryAndProviderId ) => ${error}`
      );
      throw new Error(error.message);
    }
  };

  // including active and inactive data
  fetchAllGameByGameProviderId = async (
    game_provider_id: number
  ): Promise<Game[] | []> => {
    try {
      return this.repository.findAllManyByProviderId(game_provider_id);
    } catch (error: any) {
      Logger.error(
        `Service error at ( fetchGameByGameProviderId ) => ${error}`
      );
      throw new Error(error.message);
    }
  };

  // including active and inactive data
  fetchAllGameByGameCategoryId = async (
    game_category_id: number
  ): Promise<Game[] | []> => {
    try {
      return this.repository.findAllManyByCategoryId(game_category_id);
    } catch (error: any) {
      Logger.error(
        `Service error at ( fetchGameByGameCategoryId ) => ${error}`
      );
      throw new Error(error.message);
    }
  };

  // including active and inactive data
  fetchAllGameByGameCategoryAndProviderId = async ({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<Game[] | []> => {
    try {
      return this.repository.findAllManyByProviderAndCategoryId({
        game_category_id,
        game_provider_id,
      });
    } catch (error: any) {
      Logger.error(
        `Service error at ( fetchGameByGameCategoryAndProviderId ) => ${error}`
      );
      throw new Error(error.message);
    }
  };
}
