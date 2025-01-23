import { PrismaClient } from "@prisma/client";
import { generateAgentCode, generateAgentUserName } from "../utils/common";
import { hashPassword } from "../utils/jwtUtils";
import { UserService } from "./users.service";
import { RoleService } from "./role.service";
import Logger from "../utils/logger";

export class AgentService {
  private userService: UserService;
  private roleService: RoleService;

  constructor(prisma: PrismaClient) {
    this.userService = new UserService(prisma);
    this.roleService = new RoleService(prisma);
  }

  addAgent = async ({
    name,
    phone_number,
    password,
    referral_code,
  }: {
    name: string;
    phone_number: string;
    password: string;
    referral_code: string;
  }) => {
    try {
      const existingUser =
        await this.userService.getUserByPhoneNumber(phone_number);
      if (existingUser) throw new Error("Phone number is already taken");
      const hashedPassword = await hashPassword(password);
      const parent = await this.userService.getUserByAgentCode(referral_code);
      if (!parent) throw new Error("Can not get agent data");
      const role = await this.roleService.fetchRoleByName("agent");
      if (!role) throw new Error("Can not get role data");
      const user = await this.userService.createUser({
        password: hashedPassword,
        name: name,
        role_id: role.id,
        phone_number: phone_number,
        parent_id: parent.id,
        owner_id: parent.owner_id,
      });

      if (user) {
        const username = generateAgentUserName(user.id);
        const code = generateAgentCode(user.id);
        return await this.userService.updateUser({
          id: user.id,
          username: username,
          agent_code: code,
        });
      }
    } catch (error) {
      console.error("Error creating or updating user:", error);
      Logger.error(`Service ( addAgent ) => ${error}`);
      throw new Error("User creation or update failed");
    }
  };

  fetchAgents = async ({
    agent_id,
    page,
    size,
    query,
  }: {
    agent_id: number;
    page?: number;
    size?: number;
    query?: string;
  }) => {
    try {
      return this.userService.fetchAgents({
        agent_id,
        page,
        size,
        query,
      });
    } catch (error: any) {
      Logger.error(`Service ( fetchAgents ) => ${error}`);
      throw new Error(error.message);
    }
  };

  fetchPlayers = async ({
    agent_id,
    page,
    size,
    query,
  }: {
    agent_id: number;
    page?: number;
    size?: number;
    query?: string;
  }) => {
    try {
      return this.userService.fetchPlayers({
        agent_id,
        page,
        size,
        query,
      });
    } catch (error: any) {
      Logger.error(`Service ( fetchPlayers ) => ${error}`);
      throw new Error(error.message);
    }
  };
}
