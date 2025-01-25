import { PrismaClient } from "@prisma/client";
import { GameCategoryRepository } from "../repositories/GameCategoryRepository";
import { GameCategory } from "../types/game-category";
import Logger from "../utils/logger";
import { removeFile } from "../utils/common";

export class GameCategoryService {
  private repository: GameCategoryRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new GameCategoryRepository(prisma);
  }

  createGameCategory = async ({
    name,
    image_path,
  }: {
    name: string;
    image_path?: string;
  }): Promise<GameCategory> => {
    try {
      const last = await this.repository.findLast();

      let order_number = 1;

      if (last) {
        order_number = last.order_number + 1;
      }

      const data = await this.repository.create({
        name: name,
        image_path: image_path,
        order_number: order_number,
      });

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( createGameCategory ) => ${error}`);
      throw new Error(error.message);
    }
  };

  updateGameCategory = async ({
    name,
    id,
    image_path,
    order_number,
    is_active,
  }: {
    id: number;
    name?: string;
    image_path?: string;
    order_number?: number;
    is_active?: boolean;
  }): Promise<GameCategory | null> => {
    try {
      const game_category = await this.repository.findById(id);

      if (!game_category) throw new Error("Can't get game category info");
      if (image_path && game_category.image_path) {
        await removeFile(game_category.image_path);
      }

      const data = await this.repository.update(id, {
        name,
        image_path,
        order_number,
        is_active,
      });

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( updateGameCategory ) => ${error}`);
      throw new Error(error.message);
    }
  };

  // only active game categories
  getGameCategories = async (): Promise<GameCategory[] | []> => {
    try {
      const data = await this.repository.findMany();

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( getGameCategories ) => ${error}`);
      throw new Error(error.message);
    }
  };

  getGameCategory = async (id: number): Promise<GameCategory | null> => {
    try {
      const data = await this.repository.findById(id);

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( getGameCategory ) => ${error}`);
      throw new Error(error.message);
    }
  };

  getGameCategoryByName = async (
    name: string
  ): Promise<GameCategory | null> => {
    try {
      const data = await this.repository.findByName(name);

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( getGameCategoryByName ) => ${error}`);
      throw new Error(error.message);
    }
  };

  // all records
  getAllGameCategories = async (): Promise<GameCategory[] | []> => {
    try {
      const data = await this.repository.findAll();

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( getAllGameCategories ) => ${error}`);
      throw new Error(error.message);
    }
  };
}
