import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../types/user";

export class UserService {
  private repository: IUserRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new UserRepository(prisma);
  }

  async getUserById(id: number): Promise<User> {
    try {
      const account = await this.repository.findById(id);
      if (!account) {
        throw new Error("User Info not found");
      }
      return account;
    } catch (error: any) {
      throw new Error(
        `Service error fetching user info: ${error.message}`
      );
    }
  }
}
