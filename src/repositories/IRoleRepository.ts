import { Role } from "../types/role";

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findMany(): Promise<Role[] | []>;
}
