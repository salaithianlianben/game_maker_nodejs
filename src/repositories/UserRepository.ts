import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./IUserRepository";
import { UpdateUserDTO, User } from "../types/user";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    role: true,
  };

  async findById(id: number): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  async update(id: number, to_update: UpdateUserDTO): Promise<User> {
    return this.prisma.users.update({
      where: { id: id },
      data: to_update,
      include: this.includeRelations,
    });
  }
}
