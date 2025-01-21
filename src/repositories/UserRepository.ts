import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./IUserRepository";
import { CreateUserDTO, UpdateUserDTO, User } from "../types/user";

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

  async findByPhoneNumber(
    phone_number: string
  ): Promise<Omit<User, "password"> | null> {
    return this.prisma.users.findUnique({
      where: { phone_number: phone_number },
      include: this.includeRelations,
    });
  }

  create(data: CreateUserDTO): Promise<User | null> {
    return this.prisma.users.create({
      data,
      include: this.includeRelations,
    });
  }

  findMany(): Promise<Omit<User, "password">[] | []> {
    return this.prisma.users.findMany({
      include: this.includeRelations,
    });
  }

  findManyByRoleId(role_id: number): Promise<User[] | []> {
    return this.prisma.users.findMany({
      where: { role_id: role_id },
      // include: { ...this.includeRelations, owner_sites: true },
      select: {
        id: true,
        name: true,
        role_id: true,
        role: true,
        owner_sites: true,
        phone_number: true,
        balance: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  findByAgentCode(code: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { agent_code: code },
      select: {
        id: true,
        agent_code: true,
        balance: true,
        agent_payment_account: true,
        created_at: true,
        name: true,
        owner: true,
        owner_id: true,
        parent_id: true,
        phone_number: true,
        role_id: true,
        role: true,
      },
    });
  }
}
