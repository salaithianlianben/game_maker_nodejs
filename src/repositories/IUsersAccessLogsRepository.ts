import {
  CreateUsersAccessLogsDTO,
  UsersAccessLogs,
} from "../types/users-access-logs";

export interface IUsersAccessLogsRepository {
  create(data: CreateUsersAccessLogsDTO): Promise<UsersAccessLogs>;
  findByUserId(user_id: number): Promise<UsersAccessLogs | null>;
}
