import { User } from "../types/user";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
}
