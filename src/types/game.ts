import { GameCategory } from "./game-category";
import { GameProvider } from "./game-provider";

export type Game = {
  id: number;
  name: string;
  code: string;
  game_provider_id: number;
  game_category_id: number;
  game_provider?: GameProvider;
  game_category?: GameCategory;
  is_active: boolean;
  image_path: string;
};

export interface CreateGameDTO {
  name: string;
  code: string;
  game_provider_id: number;
  game_category_id: number;
  image_path: string;
}

export interface UpdateGameDTO {
  name?: string;
  code?: string;
  game_provider_id?: number;
  game_category_id?: number;
  image_path?: string;
  is_active?: boolean;
}
