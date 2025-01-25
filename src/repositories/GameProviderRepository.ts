import { PrismaClient } from "@prisma/client";
import { IGameProviderRepository } from "./IGameProviderRepository";
import {
  CreateGameProviderDTO,
  GameProvider,
  UpdateGameProviderDTO,
} from "../types/game-provider";

export class GameProviderRepository implements IGameProviderRepository {
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    game_category_provider_relation: true,
  };

  findById(id: number): Promise<GameProvider | null> {
    return this.prisma.game_provider.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  findByName(name: string): Promise<GameProvider | null> {
    return this.prisma.game_provider.findUnique({
      where: { name: name },
      include: this.includeRelations,
    });
  }

  findMany(): Promise<GameProvider[] | []> {
    return this.prisma.game_provider.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        order_number: "asc",
      },
      include: this.includeRelations,
    });
  }

  create(data: CreateGameProviderDTO): Promise<GameProvider> {
    return this.prisma.game_provider.create({
      data,
      include: this.includeRelations,
    });
  }

  update(
    id: number,
    data: UpdateGameProviderDTO
  ): Promise<GameProvider | null> {
    return this.prisma.game_provider.update({
      where: { id },
      data,
      include: this.includeRelations,
    });
  }

  findAll(): Promise<GameProvider[] | []> {
    return this.prisma.game_provider.findMany({
      orderBy: {
        order_number: "asc",
      },
      include: this.includeRelations,
    });
  }

  findLast(): Promise<GameProvider | null> {
    return this.prisma.game_provider.findFirst({
      orderBy: {
        order_number: "desc",
      },
    });
  }
}
