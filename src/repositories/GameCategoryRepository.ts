import { PrismaClient } from "@prisma/client";
import { IGameCategoryRepository } from "./IGameCategoryRepository";
import {
  CreateGameCategoryDTO,
  GameCategory,
  UpdateGameCategoryDTO,
} from "../types/game-category";

export class GameCategoryRepository implements IGameCategoryRepository {
  constructor(private prisma: PrismaClient) {}

  findById(id: number): Promise<GameCategory | null> {
    return this.prisma.game_category.findUnique({
      where: { id },
    });
  }

  findByName(name: string): Promise<GameCategory | null> {
    return this.prisma.game_category.findUnique({
      where: { name: name },
    });
  }

  findMany(): Promise<GameCategory[] | []> {
    return this.prisma.game_category.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        order_number: "asc",
      },
    });
  }

  create(data: CreateGameCategoryDTO): Promise<GameCategory> {
    return this.prisma.game_category.create({
      data,
    });
  }

  update(
    id: number,
    data: UpdateGameCategoryDTO
  ): Promise<GameCategory | null> {
    return this.prisma.game_category.update({
      where: { id },
      data,
    });
  }

  findAll(): Promise<GameCategory[] | []> {
    return this.prisma.game_category.findMany({
      orderBy: {
        order_number: "asc",
      },
    });
  }

  findLast(): Promise<GameCategory | null> {
    return this.prisma.game_category.findFirst({
      orderBy: {
        order_number: "desc"
      }
    })
  }
}
