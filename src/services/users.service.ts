import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../types/user";
import { Decimal } from "@prisma/client/runtime/library";

export class UserService {
  private repository: IUserRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new UserRepository(prisma);
  }

  async getUserById(id: number): Promise<User> {
    try {
      const account = await this.repository.findById(id);
      if (!account) {
        throw new Error("User Info not found");
      }
      return account;
    } catch (error: any) {
      throw new Error(`Service error fetching user info: ${error.message}`);
    }
  }

  async getUserByPhoneNumber(phone_number: string): Promise<User> {
    try {
      const account = await this.repository.findByPhoneNumber(phone_number);
      if (!account) {
        throw new Error("User Info not found");
      }
      return account;
    } catch (error: any) {
      throw new Error(`Service error fetching user info: ${error.message}`);
    }
  }

  async getUserByAgentCode(code: string): Promise<User> {
    try {
      const account = await this.repository.findByAgentCode(code);
      if (!account) {
        throw new Error("User Info not found");
      }
      return account;
    } catch (error: any) {
      throw new Error(`Service error fetching user info: ${error.message}`);
    }
  }

  async createUser({
    password,
    name,
    role_id,
    phone_number,
    parent_id,
    owner_id
  }: {
    password: string;
    name: string;
    role_id: number;
    phone_number: string;
    parent_id?: number;
    owner_id?: number | null
  }): Promise<User> {
    try {
      const account = await this.repository.create({
        name: name,
        password: password,
        phone_number: phone_number,
        role_id: role_id,
        parent_id: parent_id,
        owner_id: owner_id
      });
      if (!account) {
        throw new Error("Can't create user account");
      }
      return account;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

  async updateUser({
    id,
    name,
    balance,
    username,
    agent_code
  }: {
    id: number;
    name?: string;
    balance?: number;
    username?: string;
    agent_code?: string;
  }): Promise<User | null> {
    try {
      const account = await this.repository.update(id, {
        name: name,
        balance: balance ? new Decimal(balance) : undefined,
        username: username,
      });
      if (!account) {
        throw new Error("Can't update user ifnormation");
      }
      return account;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

  async getUserByRoleId(role_id: number): Promise<User[] | []> {
    try {
      const users = await this.repository.findManyByRoleId(role_id);
      if (!users) {
        throw new Error("Can't get users ifnormation");
      }
      return users;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }
}
