import { PrismaClient } from "@prisma/client";
import Logger from "../utils/logger";
import { GameProviderRepository } from "../repositories/GameProviderRepository";
import { GameProvider } from "../types/game-provider";
import { GameCategoryProviderRepository } from "../repositories/GameCategoryProviderRepository";

export class GameProviderService {
  private repository: GameProviderRepository;
  private gameCategoryProviderRepository: GameCategoryProviderRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new GameProviderRepository(prisma);
    this.gameCategoryProviderRepository = new GameCategoryProviderRepository(
      prisma
    );
  }

  addGameProvider = async ({
    name,
    game_category_id,
  }: {
    name: string;
    game_category_id?: number[];
  }): Promise<GameProvider | null> => {
    try {
      const last = await this.repository.findLast();
      let order_number = 1;
      if (last) order_number = last.order_number + 1;

      const newData = await this.repository.create({
        name: name,
        order_number: order_number,
      });

      if (game_category_id) {
        game_category_id.map(async (cat_id) => {
          await this.gameCategoryProviderRepository.create({
            game_category_id: cat_id,
            game_provider_id: newData.id,
          });
        });
      }

      const data = await this.repository.findById(newData.id);

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( addGameProvider ) => ${error}`);
      throw new Error(error.message);
    }
  };

  updateGameProvider = async ({
    id,
    name,
    game_category_id,
    order_number,
    is_active,
  }: {
    id: number;
    name?: string;
    game_category_id?: number[];
    order_number?: number;
    is_active?: boolean;
  }): Promise<GameProvider | null> => {
    try {
      const game_category_provider_relation =
        await this.gameCategoryProviderRepository.findManyByGameProviderId(id);

      if (game_category_id && game_category_id.length > 0) {
        game_category_provider_relation.map(
          async (gcpr) =>
            await this.gameCategoryProviderRepository.delete(gcpr.id)
        );

        game_category_id.map(
          async (cat_id) =>
            await this.gameCategoryProviderRepository.create({
              game_category_id: cat_id,
              game_provider_id: id,
            })
        );
      }

      const data = await this.repository.update(id, {
        name: name,
        order_number: order_number,
        is_active: is_active,
      });

      return data;
    } catch (error: any) {
      Logger.error(`Service error at ( addGameProvider ) => ${error}`);
      throw new Error(error.message);
    }
  };

  fetchGameProvider = async (id: number): Promise<GameProvider | null> => {
    try {
      return this.repository.findById(id);
    } catch (error: any) {
      Logger.error(`Service error at ( fetchGameProvider ) => ${error}`);
      throw new Error(error.message);
    }
  };

  // Active only
  fetchGameProviders = async (): Promise<GameProvider[]> => {
    try {
      return this.repository.findMany();
    } catch (error: any) {
      Logger.error(`Service error at ( fetchGameProviders ) => ${error}`);
      throw new Error(error.message);
    }
  };

  // including all ( active, inactive ) providers
  fetchAllGameProviders = async (): Promise<GameProvider[]> => {
    try {
      return this.repository.findAll();
    } catch (error: any) {
      Logger.error(`Service error at ( fetchAllGameProviders ) => ${error}`);
      throw new Error(error.message);
    }
  };
}
