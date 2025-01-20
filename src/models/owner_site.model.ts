import prisma from "./prisma";

const createOwnerSite = async ({
  owner_id,
  site_name,
  site_url,
  logo_path,
}: {
  owner_id: number;
  site_name: string;
  site_url?: string;
  logo_path?: string;
}) => {
  return await prisma.owner_sites.create({
    data: {
      site_name: site_name,
      owner_id: owner_id,
      site_url: site_url,
      logo_path: logo_path,
    },
  });
};

const getOwnerSiteByOwnerId = async (owner_id: number) => {
  return await prisma.owner_sites.findUnique({
    where: {
      owner_id: owner_id,
    },
  });
};

export { getOwnerSiteByOwnerId, createOwnerSite };
