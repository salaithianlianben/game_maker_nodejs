import { Decimal } from "@prisma/client/runtime/library";
import { Role } from "./role";

export interface User {
  id: number;
  username: string | null;
  name: string;
  email?: string | null;
  phone_number: string;
  role_id: number;
  role?: Role;
  updated_at?: Date | null;
  created_at: Date;
  owner_id?: number | null;
  agent_code?: string | null;
  balance: Decimal | null;
  parent_id: number | null;
}

export interface UpdateUserDTO {
  name?: string
  balance?: Decimal
}