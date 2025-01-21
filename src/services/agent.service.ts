import { PrismaClient } from "@prisma/client";
import { generateAgentCode, generateAgentUserName } from "../utils/common";
import { hashPassword } from "../utils/jwtUtils";
import { UserService } from "./users.service";
import { RoleService } from "./role.service";

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
      throw new Error("User creation or update failed");
    }
  };

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
      console.error("Error creating or updating user:", error);
      throw new Error("Account registration is failed");
    }
  };
}
