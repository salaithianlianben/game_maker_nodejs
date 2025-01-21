import { PrismaClient } from "@prisma/client";
import { IOwnerSiteRepository } from "./IOwnerSiteRepository";
import {
  CreateOwnerSiteDTO,
  OwnerSite,
  UpdateOwnerSiteDTO,
} from "../types/owner-site";

export class OwnerSiteRepository implements IOwnerSiteRepository {
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    owner: true,
  };

  async findById(id: number): Promise<OwnerSite | null> {
    return this.prisma.owner_sites.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  findByOwnerId(owner_id: number): Promise<OwnerSite | null> {
    return this.prisma.owner_sites.findUnique({
      where: { owner_id: owner_id },
      include: this.includeRelations,
    });
  }

  async create(data: CreateOwnerSiteDTO): Promise<OwnerSite> {
    return this.prisma.owner_sites.create({
      data,
      include: this.includeRelations,
    });
  }

  async update(
    id: number,
    data: UpdateOwnerSiteDTO
  ): Promise<OwnerSite | null> {
    return this.prisma.owner_sites.update({
      where: { id: id },
      data: data,
    });
  }
}
