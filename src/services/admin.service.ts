import { PrismaClient } from "@prisma/client";
import { generateOwnerUserName } from "../utils/common";
import { hashPassword } from "../utils/jwtUtils";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IRoleRepository } from "../repositories/IRoleRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { IOwnerSiteRepository } from "../repositories/IOwnerSiteRepository";
import { OwnerSiteRepository } from "../repositories/OwnerSiteRepository";
import { UserService } from "./users.service";
import { RoleService } from "./role.service";
import { OwnerSiteService } from "./owner-site.service";

export class AdminService {
  private userService: UserService;
  private roleService: RoleService;
  private ownerSiteService: OwnerSiteService;

  constructor(prisma: PrismaClient) {
    this.userService = new UserService(prisma);
    this.roleService = new RoleService(prisma);
    this.ownerSiteService = new OwnerSiteService(prisma);
  }

  addOwner = async ({
    password,
    name,
    phone_number,
    site_name,
    site_url,
    logo_path,
  }: {
    password: string;
    name: string;
    phone_number: string;
    site_name: string;
    site_url?: string;
    logo_path?: string;
  }) => {
    try {
      const existingUser =
        await this.userService.getUserByPhoneNumber(phone_number);
      if (existingUser) {
        throw new Error(
          "Phone number is already existed!. Please use another one."
        );
      }

      const role = await this.roleService.fetchRoleByName("owner");

      if (!role) {
        throw new Error("Fetching role by role name");
      }

      const hashedPassword = await hashPassword(password);
      const owner = await this.userService.createUser({
        password: hashedPassword,
        name: name,
        role_id: role.id,
        phone_number: phone_number,
      });

      if (owner) {
        const username = generateOwnerUserName(owner.id);
        const updatedOwner = await this.userService.updateUser({
          id: owner.id,
          username: username,
        });

        const owner_site = await this.ownerSiteService.create({
          owner_id: owner.id,
          site_name: site_name,
          site_url: site_url,
          logo_path: logo_path,
        });

        return {
          ...updatedOwner,
          owner_sites: {
            ...owner_site,
          },
        };
      }
    } catch (error) {
      console.error("Error creating owner:", error);
      throw error;
    }
  };

  fetchOwners = async () => {
    try {
      const role = await this.roleService.fetchRoleByName("owner");
      if (!role) throw new Error("Can't get role information.");
      return this.userService.getUserByRoleId(role.id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}
