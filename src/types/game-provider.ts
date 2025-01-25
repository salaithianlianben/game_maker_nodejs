import { GameCategoryProviderRelation } from "./game-category-provider-relation";

export type GameProvider = {
  id: number;
  name: string;
  order_number: number;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date | null;
  game_category_provider_relation?: GameCategoryProviderRelation[] | []
};

export interface CreateGameProviderDTO {
  name: string;
  order_number: number;
}

export interface UpdateGameProviderDTO {
  name?: string;
  order_number?: number;
  is_active?: boolean;
}
