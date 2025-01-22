import { PrismaClient } from "@prisma/client";
import { IOwnerSiteRepository } from "../repositories/IOwnerSiteRepository";
import { OwnerSiteRepository } from "../repositories/OwnerSiteRepository";
import Logger from "../utils/logger";

export class OwnerSiteService {
  private ownersiteRepository: IOwnerSiteRepository;

  constructor(prisma: PrismaClient) {
    this.ownersiteRepository = new OwnerSiteRepository(prisma);
  }

  async create({
    owner_id,
    site_url,
    site_name,
    logo_path,
  }: {
    owner_id: number;
    site_url?: string;
    site_name: string;
    logo_path?: string;
  }) {
    try {
      return this.ownersiteRepository.create({
        owner_id: owner_id,
        site_name: site_name,
        logo_path: logo_path,
        site_url: site_url,
      });
    } catch (error: any) {
      Logger.error(`Service ( create ) => ${error}`);
      throw new Error(error.message);
    }
  }

  async fetchOwnerSite(id: number) {
    try {
      return this.ownersiteRepository.findById(id);
    } catch (error: any) {
      Logger.error(`Service ( fetchOwnerSite ) => ${error}`);
      throw new Error(error.message);
    }
  }

  async fetchOwnerSiteByOwnerId(owner_id: number) {
    try {
      return this.ownersiteRepository.findByOwnerId(owner_id);
    } catch (error: any) {
      Logger.error(`Service ( fetchOwnerSiteByOwnerId ) => ${error}`);
      throw new Error(error.message);
    }
  }

  async updateOwnerSite({
    id,
    site_name,
    site_url,
    logo_path,
  }: {
    id: number;
    site_name?: string;
    site_url?: string;
    logo_path?: string;
  }) {
    try {
      return this.ownersiteRepository.update(id, {
        logo_path,
        site_name,
        site_url,
      });
    } catch (error: any) {
      Logger.error(`Service ( updateOwnerSite ) => ${error}`);
      throw new Error(error.message);
    }
  }
}
