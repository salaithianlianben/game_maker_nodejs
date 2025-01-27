import { CreateGameDTO, Game, UpdateGameDTO } from "../types/game";

export interface IGameRepository {
  create(data: CreateGameDTO): Promise<Game>;
  update(id: number, data: UpdateGameDTO): Promise<Game | null>;
  findById(id: number): Promise<Game | null>;
  findManyByProviderId(game_provider_id: number): Promise<Game[] | []>;
  findManyByCategoryId(game_category_id: number): Promise<Game[] | []>;
  findManyByProviderAndCategoryId({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<Game[] | []>;
  findMany(): Promise<Game[] | []>;
  findAll(): Promise<Game[] | []>;
  findAllManyByProviderId(game_provider_id: number): Promise<Game[] | []>;
  findAllManyByCategoryId(game_category_id: number): Promise<Game[] | []>;
  findAllManyByProviderAndCategoryId({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<Game[] | []>;
}
