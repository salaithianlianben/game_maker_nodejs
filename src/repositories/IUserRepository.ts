import { UpdateUserDTO, User } from "../types/user";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  update(id: number, data: UpdateUserDTO): Promise<User>;
}
