import { CreateGameProviderDTO, GameProvider, UpdateGameProviderDTO } from "../types/game-provider";

export interface IGameProviderRepository {
  create(data: CreateGameProviderDTO): Promise<GameProvider>;
  findById(id: number): Promise<GameProvider | null>;
  findMany(): Promise<GameProvider[] | []>;
  update(id: number, data: UpdateGameProviderDTO): Promise<GameProvider | null>;
  findByName(name: string): Promise<GameProvider | null>;
  findLast(): Promise<GameProvider | null>;
}
