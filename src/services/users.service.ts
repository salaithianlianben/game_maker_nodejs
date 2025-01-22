import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../types/user";
import { Decimal } from "@prisma/client/runtime/library";
import Logger from "../utils/logger";

export class UserService {
  private repository: IUserRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new UserRepository(prisma);
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const account = await this.repository.findById(id);
      if (!account) {
        return null;
      }
      return account;
    } catch (error: any) {
      throw new Error(`Service error fetching user info: ${error.message}`);
    }
  }

  async getUserByPhoneNumber(phone_number: string): Promise<User | null> {
    try {
      const account = await this.repository.findByPhoneNumber(phone_number);
      if (!account) {
        return null;
      }
      return account;
    } catch (error: any) {
      throw new Error(`Service error fetching user info: ${error.message}`);
    }
  }

  async getUserByAgentCode(code: string): Promise<User | null> {
    try {
      const account = await this.repository.findByAgentCode(code);
      if (!account) {
        return null;
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
    owner_id,
  }: {
    password: string;
    name: string;
    role_id: number;
    phone_number: string;
    parent_id?: number;
    owner_id?: number | null;
  }): Promise<User> {
    try {
      const account = await this.repository.create({
        name: name,
        password: password,
        phone_number: phone_number,
        role_id: role_id,
        parent_id: parent_id,
        owner_id: owner_id,
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
    agent_code,
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
        agent_code: agent_code,
      });
      if (!account) {
        throw new Error("Can't update user infromation");
      }
      return account;
    } catch (error: any) {
      Logger.error(error);
      throw new Error(`${error.message}`);
    }
  }

  // async getUsersByRoleId({
  //   role_id,
  //   page,
  //   size,
  //   query,
  // }: {
  //   role_id: number;
  //   page?: number;
  //   size?: number;
  //   query?: string;
  // }): Promise<{ total: number; data: User[] }> {
  //   try {
  //     const { total, data } = await this.repository.fin({
  //       role_id,
  //       page,
  //       size,
  //       query,
  //     });
  //     if (!data) {
  //       throw new Error("Can't get users ifnormation");
  //     }
  //     return { total, data };
  //   } catch (error: any) {
  //     Logger.error(error);
  //     throw new Error(`${error.message}`);
  //   }
  // }

  async fetchOwners({
    page,
    size,
    query,
  }: {
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: User[] }> {
    try {
      const { total, data } = await this.repository.findManyOwners({
        page,
        size,
        query,
      });
      if (!data) {
        throw new Error("Can't get owners information");
      }
      return { total, data };
    } catch (error: any) {
      Logger.error(error);
      throw new Error(`${error.message}`);
    }
  }

  async fetchAgents({
    agent_id,
    page,
    size,
    query,
  }: {
    agent_id: number
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: User[] }> {
    try {
      const { total, data } = await this.repository.findManyAgents({
        agent_id,
        page,
        size,
        query,
      });
      if (!data) {
        throw new Error("Can't get users information");
      }
      return { total, data };
    } catch (error: any) {
      Logger.error(error);
      throw new Error(`${error.message}`);
    }
  }

  async fetchBaseAgent({
    owner_id,
    page,
    size,
    query,
  }: {
    owner_id: number
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: User[] }> {
    try {
      const { total, data } = await this.repository.findManyBaseAgents({
        owner_id,
        page,
        size,
        query,
      });
      if (!data) {
        throw new Error("Can't get users information");
      }
      return { total, data };
    } catch (error: any) {
      Logger.error(error);
      throw new Error(`${error.message}`);
    }
  }
}
