import { PrismaClient } from "@prisma/client";
import { IRoleRepository } from "../repositories/IRoleRepository";
import Logger from "../utils/logger";
import { RoleRepository } from "../repositories/RoleRepository";

export class RoleService {
  private repository: IRoleRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new RoleRepository(prisma);
  }

  async fetchRoleById(id: number) {
    try {
      return await this.repository.findById(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async fetchRoleByName(name: string) {
    try {
      return await this.repository.findByName(name);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async fetchRoles() {
    try {
      return await this.repository.findMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
