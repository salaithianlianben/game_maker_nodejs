import { CreateOwnerSiteDTO, OwnerSite, UpdateOwnerSiteDTO } from "../types/owner-site";

export interface IOwnerSiteRepository {
  create(data: CreateOwnerSiteDTO): Promise<OwnerSite>;
  findById(id: number): Promise<OwnerSite | null>;
  findByOwnerId(owner_id: number): Promise<OwnerSite | null>;
  update(id: number, data: UpdateOwnerSiteDTO): Promise<OwnerSite | null>;
}
