import { PrismaClient } from "@prisma/client";
import { UserService } from "./users.service";
import { hashPassword } from "../utils/jwtUtils";
import { RoleService } from "./role.service";
import { generateAgentCode, generateAgentUserName } from "../utils/common";
import Logger from "../utils/logger";

export class OwnerService {
  private userService: UserService;
  private roleService: RoleService;

  constructor(prisma: PrismaClient) {
    this.userService = new UserService(prisma);
    this.roleService = new RoleService(prisma);
  }

  addBaseAgent = async ({
    name,
    password,
    phone_number,
    owner_id,
  }: {
    name: string;
    password: string;
    phone_number: string;
    owner_id: number;
  }) => {
    try {
      const existingUser =
        await this.userService.getUserByPhoneNumber(phone_number);
      if (existingUser) throw new Error("Phone number is already taken");
      const hashedPassword = await hashPassword(password);
      const role = await this.roleService.fetchRoleByName("agent");
      if (!role) throw new Error("Fail at fetching roles by agent ");
      const user = await this.userService.createUser({
        password: hashedPassword,
        name: name,
        role_id: role.id,
        phone_number: phone_number,
        owner_id: owner_id,
      });

      if (user) {
        const username = generateAgentUserName(user.id);
        const agentCode = generateAgentCode(user.id);
        return await this.userService.updateUser({
          id: user.id,
          username: username,
          agent_code: agentCode,
        });
      }
    } catch (error) {
      Logger.error(`Service ( addBaseAgent ) => ${error}`);
      console.error("Error creating or updating user:", error);
      throw new Error("Agent account registration is failed");
    }
  };

  fetchBasedAgents = async ({
    owner_id,
    page,
    size,
    query,
  }: {
    owner_id: number;
    page?: number;
    size?: number;
    query?: string;
  }) => {
    try {
      return this.userService.fetchBaseAgent({
        owner_id,
        page,
        size,
        query,
      });
    } catch (error: any) {
      Logger.error(`Service ( fetchBasedAgents ) => ${error}`);
      throw new Error(error.message);
    }
  };
}
