import { GameCategory } from "./game-category";
import { GameProvider } from "./game-provider";

export type GameCategoryProviderRelation = {
  id: number;
  game_category_id: number;
  game_category?: GameCategory | null;
  game_provider_id: number;
  game_provider?: GameProvider | null;
  image_path?: string | null;
};

export interface CreateGameCategoryProviderRelationDTO {
    game_category_id: number
    game_provider_id: number
    image_path?: string | null
}

export interface UpdateGameCategoryProviderRelationDTO {
    game_category_id?: number
    game_provider_id?: number
    image_path?: string | null
}