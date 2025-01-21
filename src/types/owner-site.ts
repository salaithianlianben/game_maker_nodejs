export type OwnerSite ={
    id: number
    site_name: string
    site_url: string | null
    logo_path: string | null
}

export interface CreateOwnerSiteDTO {
    site_name: string
    site_url?: string
    logo_path?: string
    owner_id: number
}

export interface UpdateOwnerSiteDTO {
    site_name?: string
    site_url?: string
    logo_path?: string
}