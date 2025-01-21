import { CreateUserDTO, UpdateUserDTO, User } from "../types/user";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  update(id: number, data: UpdateUserDTO): Promise<User>;
  findByPhoneNumber(phone_number: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User | null>;
  findMany(): Promise<User[] | []>;
  findManyByRoleId(role_id: number): Promise<User[] | []>;
  findByAgentCode(code: string): Promise<User | null>;
}
