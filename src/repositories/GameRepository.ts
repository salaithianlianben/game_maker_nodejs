import { PrismaClient } from "@prisma/client";
import { IGameRepository } from "./IGameRepository";
import { CreateGameDTO, Game, UpdateGameDTO } from "../types/game";

export class GameRepository implements IGameRepository {
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    game_provider: true,
    game_category: true,
  };

  create(data: CreateGameDTO): Promise<Game> {
    return this.prisma.game.create({
      data,
      include: this.includeRelations,
    });
  }

  findById(id: number): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: { id: id },
      include: this.includeRelations,
    });
  }

  // active data
  findManyByCategoryId(game_category_id: number): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      where: {
        game_category_id: game_category_id,
        is_active: true,
      },
      include: this.includeRelations,
    });
  }

  // active data
  findManyByProviderAndCategoryId({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      where: {
        game_category_id,
        game_provider_id,
        is_active: true,
      },
      include: this.includeRelations,
    });
  }

  // active data
  findManyByProviderId(game_provider_id: number): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      where: { game_provider_id, is_active: true },
      include: this.includeRelations,
    });
  }

  update(id: number, data: UpdateGameDTO): Promise<Game | null> {
    return this.prisma.game.update({
      where: {
        id: id,
      },
      data,
      include: this.includeRelations,
    });
  }

  // including active and inactive

  findAll(): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      include: this.includeRelations,
    });
  }

  // active only
  findMany(): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      where: {
        is_active: true,
      },
      include: this.includeRelations,
    });
  }

  // including active and inactive data
  findAllManyByProviderAndCategoryId({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      where: {
        game_category_id,
        game_provider_id,
      },
      include: this.includeRelations,
    });
  }

  // including active and inactive data
  findAllManyByProviderId(game_provider_id: number): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      where: { game_provider_id },
      include: this.includeRelations,
    });
  }

  // including active and inactive data
  findAllManyByCategoryId(game_category_id: number): Promise<Game[] | []> {
    return this.prisma.game.findMany({
      where: {
        game_category_id: game_category_id
      },
      include: this.includeRelations,
    });
  }
}
