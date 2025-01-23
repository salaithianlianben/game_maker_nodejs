import jwt from "jsonwebtoken";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../utils/jwtUtils";
import { UserService } from "./users.service";
import { PrismaClient } from "@prisma/client";
import Logger from "../utils/logger";
import { generatePlayerUserName } from "../utils/common";
import { RoleService } from "./role.service";

export class AuthService {
  private userService: UserService;
  private roleService: RoleService;

  constructor(prisma: PrismaClient) {
    this.userService = new UserService(prisma);
    this.roleService = new RoleService(prisma);
  }

  loginUser = async (identifier: string, password: string) => {
    try {
      const normalizedIdentifier = identifier
        .replace(/\s+/g, "")
        .replace(/[^\w\s]/gi, "");

      let user;
      if (/^\+?\d+$/.test(normalizedIdentifier)) {
        // Find user by phone number
        user =
          await this.userService.getUserByPhoneNumber(normalizedIdentifier);
      } else {
        user = await this.userService.getUserByUserName(normalizedIdentifier);
      }

      if (!user) {
        throw new Error("User not found");
      }

      if (user.is_active === false)
        throw new Error(
          "Your account is inactivated. Please, contact to your agent or admin or owner."
        );

      // Validate the password
      const isPasswordValid = await comparePassword(password, user.password!);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const token = generateToken({
        userId: user.id.toString(),
        role: user.role!.name,
      });

      return { user, token };
    } catch (error: any) {
      Logger.error(`Service ( loginUser ) => ${error}`);
      throw new Error(error.message);
    }
  };

  verifyToken = async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        throw new Error("Invalid token");
      }
      return decoded;
    } catch (error) {
      Logger.error(`Service ( verifyToken ) => ${error}`);
      throw new Error("Invalid token");
    }
  };

  addPlayer = async ({
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
      const role = await this.roleService.fetchRoleByName("player");
      if (!role) throw new Error("Player role data is not found");
      const existingUser =
        await this.userService.getUserByPhoneNumber(phone_number);
      if (existingUser) throw new Error("Phone number is already taken");
      const hashedPassword = await hashPassword(password);
      const parent = await this.userService.getUserByAgentCode(referral_code);
      if (!parent) throw new Error("Referral code is invalid.");
      const user = await this.userService.createUser({
        password: hashedPassword,
        name: name,
        role_id: role.id,
        phone_number: phone_number,
        parent_id: parent.id,
        owner_id: parent.owner_id,
      });

      if (user) {
        const username = generatePlayerUserName(user.id);
        return await this.userService.updateUser({
          id: user.id,
          username: username,
        });
      }
    } catch (error: any) {
      Logger.error(`Service ( addPlayer ) => ${error}`);
      throw new Error(error.message);
    }
  };
}
