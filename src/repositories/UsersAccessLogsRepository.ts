import { PrismaClient } from "@prisma/client";
import { IUsersAccessLogsRepository } from "./IUsersAccessLogsRepository";
import {
  CreateUsersAccessLogsDTO,
  UsersAccessLogs,
} from "../types/users-access-logs";

export class UsersAccessLogsRepository implements IUsersAccessLogsRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: CreateUsersAccessLogsDTO): Promise<UsersAccessLogs> {
    return this.prisma.users_access_logs.create({
      data,
    });
  }

  findByUserId(user_id: number): Promise<UsersAccessLogs | null> {
    return this.prisma.users_access_logs.findFirst({
      where: {
        user_id: user_id,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}
