import { PrismaClient } from "@prisma/client";
import { IGameCategoryProviderRepository } from "./IGameCategoryProviderRepository";
import {
  CreateGameCategoryProviderRelationDTO,
  GameCategoryProviderRelation,
  UpdateGameCategoryProviderRelationDTO,
} from "../types/game-category-provider-relation";

export class GameCategoryProviderRepository
  implements IGameCategoryProviderRepository
{
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    game_provider: true,
    game_category: true,
  };

  findById(id: number): Promise<GameCategoryProviderRelation | null> {
    return this.prisma.game_category_provider_relation.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  findMany(): Promise<GameCategoryProviderRelation[] | []> {
    return this.prisma.game_category_provider_relation.findMany({
      include: this.includeRelations,
    });
  }

  create(
    data: CreateGameCategoryProviderRelationDTO
  ): Promise<GameCategoryProviderRelation> {
    return this.prisma.game_category_provider_relation.create({
      data,
      include: this.includeRelations,
    });
  }

  update(
    id: number,
    data: UpdateGameCategoryProviderRelationDTO
  ): Promise<GameCategoryProviderRelation | null> {
    return this.prisma.game_category_provider_relation.update({
      where: { id },
      data,
      include: this.includeRelations,
    });
  }

  delete(id: number): Promise<GameCategoryProviderRelation | null> {
    return this.prisma.game_category_provider_relation.delete({
      where: {
        id: id,
      },
    });
  }

  findManyByGameCategoryId(
    game_category_id: number
  ): Promise<GameCategoryProviderRelation[] | []> {
    return this.prisma.game_category_provider_relation.findMany({
      where: {
        game_category_id: game_category_id,
      },
      include: this.includeRelations,
    });
  }

  findManyByGameProviderId(
    game_provider_id: number
  ): Promise<GameCategoryProviderRelation[] | []> {
    return this.prisma.game_category_provider_relation.findMany({
      where: {
        game_provider_id: game_provider_id,
      },
      include: this.includeRelations,
    });
  }

  findByGameProviderAndCategoryId({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<GameCategoryProviderRelation | null> {
    return this.prisma.game_category_provider_relation.findFirst({
      where: {
        game_category_id: game_category_id,
        game_provider_id: game_provider_id,
      },
      include: this.includeRelations,
    });
  }
}
