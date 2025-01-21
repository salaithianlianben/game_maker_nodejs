import { PrismaClient } from "@prisma/client";
import {
  getRoleByIdFromDB,
  getRoleByNameFromDB,
  getRolesFromDB,
} from "../models/role.model";
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

const fetchRoleById = async (id: number) => {
  try {
    return await getRoleByIdFromDB(id);
  } catch (error) {
    Logger.error(`Error fetching role by ID: ${id} - ${error}`);
    throw new Error(`Failed to fetch role by ID: ${id}`);
  }
};

const fetchRoleByName = async (name: string) => {
  try {
    return await getRoleByNameFromDB(name);
  } catch (error) {
    Logger.error(`Error fetching role by name: ${name} - ${error}`);
    throw new Error(`Failed to fetch role by name: ${name}`);
  }
};

const fetchRoles = async () => {
  try {
    return await getRolesFromDB();
  } catch (error) {
    Logger.error(`Error fetching roles: ${error}`);
    throw new Error("Failed to fetch roles");
  }
};

export { fetchRoleById, fetchRoleByName, fetchRoles };
