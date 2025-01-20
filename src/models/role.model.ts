import prisma from "../models/prisma";

const getRoleByIdFromDB = async (id: number) => {
  return await prisma.roles.findUnique({
    where: {
      id: id,
    },
  });
};

const getRoleByNameFromDB = async (name: string) => {
  return await prisma.roles.findUnique({
    where: {
      name: name,
    },
  });
};

const getRolesFromDB = async () => {
  return await prisma.roles.findMany();
};

export { getRoleByIdFromDB, getRoleByNameFromDB, getRolesFromDB };
