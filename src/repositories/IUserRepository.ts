import { CreateUserDTO, UpdateUserDTO, User } from "../types/user";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  update(id: number, data: UpdateUserDTO): Promise<User>;
  findByPhoneNumber(phone_number: string): Promise<User | null>;
  findByUserName(username: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User | null>;
  findMany(): Promise<User[] | []>;
  findByAgentCode(code: string): Promise<User | null>;
  findManyOwners({
    page,
    size,
    query,
  }: {
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }>;
  findManyBaseAgents({
    owner_id,
    page,
    size,
    query,
  }: {
    owner_id: number;
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }>;
  findManyAgents({
    agent_id,
    page,
    size,
    query,
  }: {
    agent_id: number;
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }>;
  findManyPlayers({
    agent_id,
    page,
    size,
    query,
  }: {
    agent_id: number;
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }>;
}
