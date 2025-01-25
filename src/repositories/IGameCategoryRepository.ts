import {
  CreateGameCategoryDTO,
  GameCategory,
  UpdateGameCategoryDTO,
} from "../types/game-category";

export interface IGameCategoryRepository {
  create(data: CreateGameCategoryDTO): Promise<GameCategory>;
  findById(id: number): Promise<GameCategory | null>;
  findMany(): Promise<GameCategory[] | []>;
  update(id: number, data: UpdateGameCategoryDTO): Promise<GameCategory | null>;
  findByName(name: string): Promise<GameCategory | null>;
  findAll(): Promise<GameCategory[] | []>;
  findLast(): Promise<GameCategory | null>;
}
