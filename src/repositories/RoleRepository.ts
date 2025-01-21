import { PrismaClient } from "@prisma/client";
import { IRoleRepository } from "./IRoleRepository";
import { Role } from "../types/role";

export class RoleRepository implements IRoleRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Role | null> {
    return this.prisma.roles.findUnique({
      where: { id },
    });
  }

  findByName(name: string): Promise<Role | null> {
    return this.prisma.roles.findUnique({
      where: { name: name },
    });
  }

  async findMany(): Promise<Role[] | []> {
    return this.prisma.roles.findMany();
  }
}
