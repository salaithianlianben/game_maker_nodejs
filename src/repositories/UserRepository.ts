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

  async findByPhoneNumber(phone_number: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { phone_number: phone_number },
      include: this.includeRelations,
    });
  }

  async findByUserName(username: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { username: username },
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
      where: {
        is_active: true,
      }
    });
  }

  async findManyOwners({
    page = 1,
    size = 10,
    query = "",
  }: {
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }> {
    const skip = (page - 1) * size;

    const role = await this.prisma.roles.findUnique({
      where: { name: "owner" },
    });
    const overallTotal = await this.prisma.users.count({
      where: {
        role_id: role?.id,
      },
    });

    const responseData = await this.prisma.$queryRaw<any[]>`
      SELECT 
        u.id,
        u.name,
        u.phone_number,
        u.balance,
        u.role_id,
        u.is_active,
        (
          SELECT CAST(COUNT(*) AS SIGNED)
          FROM users a
          JOIN roles r ON r.id = a.role_id
          WHERE r.name = 'agent' AND a.owner_id = u.id
        ) AS total_agent,
        (
          SELECT CAST(COUNT(*) AS SIGNED)
          FROM users p
          JOIN roles r ON r.id = p.role_id
          WHERE r.name = 'player' AND p.owner_id = u.id
        ) AS total_player
      FROM users u 
      WHERE u.role_id = ${role?.id}
        AND (u.name LIKE ${`%${query}%`} OR u.phone_number LIKE ${`%${query}%`})
      ORDER BY u.created_at DESC
      LIMIT ${size} OFFSET ${skip}`;

    const data = (responseData as any[]).map((row) => ({
      ...row,
      total_agent: row.total_agent ? Number(row.total_agent) : 0,
      total_player: row.total_player ? Number(row.total_player) : 0,
    }));

    return { total: overallTotal, data: data };
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
        is_active: true,
      },
    });
  }

  async findManyBaseAgents({
    owner_id,
    page = 1,
    size = 10,
    query = "",
  }: {
    owner_id: number;
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }> {
    const skip = (page - 1) * size;

    const role = await this.prisma.roles.findUnique({
      where: { name: "agent" },
    });

    const overallTotal = await this.prisma.users.count({
      where: {
        owner_id: owner_id,
        parent_id: null,
        role_id: role?.id,
      },
    });

    const responseData = await this.prisma.$queryRaw<any[]>`
      SELECT 
        u.id,
        u.name,
        u.phone_number,
        u.balance,
        u.agent_code,
        u.parent_id,
        u.owner_id,
        u.role_id,
        u.is_active,
        (
          SELECT CAST(COUNT(*) AS SIGNED)
          FROM users a
          JOIN roles r ON r.id = a.role_id
          WHERE r.name = 'agent' AND a.parent_id = u.id
        ) AS total_agent,
        (
          SELECT CAST(COUNT(*) AS SIGNED)
          FROM users p
          JOIN roles r ON r.id = p.role_id
          WHERE r.name = 'player' AND p.parent_id = u.id
        ) AS total_player
      FROM users u 
      JOIN roles r ON r.id = u.role_id
      WHERE u.owner_id = ${owner_id}
        AND (u.name LIKE ${`%${query}%`} OR u.phone_number LIKE ${`%${query}%`}) AND u.parent_id IS NULL AND r.name = 'agent'
      ORDER BY u.created_at DESC
      LIMIT ${size} OFFSET ${skip}`;

    const data = (responseData as any[]).map((row) => ({
      ...row,
      total_agent: row.total_agent ? Number(row.total_agent) : 0,
      total_player: row.total_player ? Number(row.total_player) : 0,
    }));

    return { total: overallTotal, data: data };
  }

  async findManyAgents({
    agent_id,
    page = 1,
    size = 10,
    query,
  }: {
    agent_id: number;
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }> {
    const skip = (page - 1) * size;

    const role = await this.prisma.roles.findUnique({
      where: { name: "agent" },
    });

    const overallTotal = await this.prisma.users.count({
      where: {
        parent_id: agent_id,
        role_id: role?.id,
      },
    });

    const responseData = await this.prisma.$queryRaw<any[]>`
      SELECT 
        u.id,
        u.name,
        u.phone_number,
        u.balance,
        u.parent_id,
        u.owner_id,
        u.agent_code,
        u.role_id,
        u.is_active,
        (
          SELECT CAST(COUNT(*) AS SIGNED)
          FROM users a
          JOIN roles r ON r.id = a.role_id
          WHERE r.name = 'agent' AND a.parent_id = u.id
        ) AS total_agent,
        (
          SELECT CAST(COUNT(*) AS SIGNED)
          FROM users p
          JOIN roles r ON r.id = p.role_id
          WHERE r.name = 'player' AND p.parent_id = u.id
        ) AS total_player
      FROM users u 
      JOIN roles r ON r.id = u.role_id
      WHERE u.parent_id = ${agent_id}
        AND (u.name LIKE ${`%${query}%`} OR u.phone_number LIKE ${`%${query}%`}) AND u.parent_id IS NOT NULL AND r.name = 'agent'
      ORDER BY u.created_at DESC
      LIMIT ${size} OFFSET ${skip}`;

    const data = (responseData as any[]).map((row) => ({
      ...row,
      total_agent: row.total_agent ? Number(row.total_agent) : 0,
      total_player: row.total_player ? Number(row.total_player) : 0,
    }));

    return { total: overallTotal, data: data };
  }

  async findManyPlayers({
    agent_id,
    page = 1,
    size = 10,
    query = "",
  }: {
    agent_id: number;
    page?: number;
    size?: number;
    query?: string;
  }): Promise<{ total: number; data: any[] }> {
    const skip = (page - 1) * size;

    const role = await this.prisma.roles.findUnique({
      where: { name: "player" },
    });

    const overallTotal = await this.prisma.users.count({
      where: {
        parent_id: agent_id,
        role_id: role?.id,
      },
    });

    const data = await this.prisma.users.findMany({
      where: {
        role_id: role?.id,
        parent_id: agent_id,
        AND: query
          ? [
              {
                name: {
                  contains: query,
                },
              },
            ]
          : [],
      },
      orderBy: { created_at: "desc" },

      skip: skip,
      take: size,
    });

    return { total: overallTotal, data: data };
  }
}
