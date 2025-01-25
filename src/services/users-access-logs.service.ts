import { PrismaClient } from "@prisma/client";
import { UsersAccessLogsRepository } from "../repositories/UsersAccessLogsRepository";
import { UsersAccessLogs } from "../types/users-access-logs";
import Logger from "../utils/logger";

export class UsersAccessLogsService {
  private repository: UsersAccessLogsRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new UsersAccessLogsRepository(prisma);
  }

  async createUserLogs({
    user_id,
    ip_address,
  }: {
    ip_address: string;
    user_id: number;
  }): Promise<UsersAccessLogs> {
    try {
      return this.repository.create({
        user_id,
        ip_address,
      });
    } catch (error: any) {
      Logger.error(`Service error at (createUserLogs) ${error.message}`);
      throw new Error(error.message);
    }
  }

  async getUserLogByUserId(user_id: number): Promise<UsersAccessLogs | null> {
    try {
      return this.repository.findByUserId(user_id);
    } catch (error: any) {
      Logger.error(`Service error at (getUserLogByUserId) ${error.message}`);
      throw new Error(error.message);
    }
  }
}
