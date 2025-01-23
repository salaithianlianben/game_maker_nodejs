import { Decimal } from "@prisma/client/runtime/library";
import { Role } from "./role";
import { OwnerSite } from "./owner-site";

export interface User {
  id: number;
  username?: string | null;
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
  parent_id?: number | null;
  password?: string;
  owner_sites?: OwnerSite | null;
  is_active: boolean
}

export interface UpdateUserDTO {
  name?: string;
  balance?: Decimal;
  username?: string;
  agent_code?: string;
  is_active?: boolean
}

export interface CreateUserDTO {
  password: string;
  name: string;
  role_id: number;
  phone_number: string;
  parent_id?: number;
  owner_id?: number | null;
}
