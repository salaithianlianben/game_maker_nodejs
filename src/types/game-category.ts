export type GameCategory = {
  id: number;
  name: string;
  order_number: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  image_path?: string | null;
};

export interface CreateGameCategoryDTO {
  name: string;
  order_number: number;
  image_path?: string | null;
  is_active?: boolean;
}

export interface UpdateGameCategoryDTO {
  name?: string;
  order_number?: number;
  image_path?: string;
  is_active?: boolean;
}
