import { User } from "./user"

export type UsersAccessLogs = {
    id: number
    ip_address: string
    created_at: Date
    user_id: number
    user?: User
}

export interface CreateUsersAccessLogsDTO {
    ip_address: string
    user_id: number
}
