import {
  CreateGameCategoryProviderRelationDTO,
  GameCategoryProviderRelation,
  UpdateGameCategoryProviderRelationDTO,
} from "../types/game-category-provider-relation";

export interface IGameCategoryProviderRepository {
  create(
    data: CreateGameCategoryProviderRelationDTO
  ): Promise<GameCategoryProviderRelation>;
  findById(id: number): Promise<GameCategoryProviderRelation | null>;
  findMany(): Promise<GameCategoryProviderRelation[] | []>;
  update(
    id: number,
    data: UpdateGameCategoryProviderRelationDTO
  ): Promise<GameCategoryProviderRelation | null>;
  delete(id: number): Promise<GameCategoryProviderRelation | null>;
  findManyByGameCategoryId(
    game_category_id: number
  ): Promise<GameCategoryProviderRelation[] | []>;
  findManyByGameProviderId(
    game_provider_id: number
  ): Promise<GameCategoryProviderRelation[] | []>;
  findByGameProviderAndCategoryId({
    game_category_id,
    game_provider_id,
  }: {
    game_category_id: number;
    game_provider_id: number;
  }): Promise<GameCategoryProviderRelation | null>;
  // deleteBygameCategoryId(game_category_id: number): Promise<GameCategoryProviderRelation | null>;
  // deleteBygameProviderId(game_provider_id: number): Promise<GameCategoryProviderRelation | null>;
}
