import { Decimal } from "@prisma/client/runtime/library";
import prisma from "./prisma";

export const getUsers = async () => {
  return await prisma.users.findMany();
};

export const createUser = async (data: {
  name: string;
  password: string;
  role_id: number;
  phone_number: string;
  owner_id?: number | null;
  agent_code?: string | null;
  parent_id?: number | null;
}) => {
  return await prisma.users.create({
    data: {
      password: data.password,
      name: data.name,
      role_id: data.role_id,
      phone_number: data.phone_number,
      owner_id: data.owner_id,
      agent_code: data.agent_code,
      balance: 0.0,
      parent_id: data.parent_id,
    },
  });
};

export const updateUser = async (update: {
  id: number;
  name?: string;
  password?: string;
  username?: string;
  balance?: Decimal;
  agent_code?: string;
}) => {
  return await prisma.users.update({
    where: {
      id: update.id,
    },
    data: {
      balance: update.balance,
      name: update.name,
      password: update.password,
      username: update.username,
      agent_code: update.agent_code,
    },
  });
};

export const getUserByAgentCode = async (code: string) => {
  return await prisma.users
    .findUniqueOrThrow({
      where: {
        agent_code: code,
      },
      include: {
        role: true,
      },
    })
    .then((user) => {
      if (user.role.name !== "agent") {
        throw new Error("User is not an agent");
      }
      return user;
    });
};

export const getUserById = async (id: number) => {
  return await prisma.users.findUnique({
    where: {
      id: id,
    },
    include: {
      role: true,
    },
  });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.users.findUnique({
    where: {
      username: username,
    },
    include: {
      role: true,
    },
  });
};

export const getUserByPhoneNumber = async (phone: string) => {
  return await prisma.users.findUnique({
    where: {
      phone_number: phone,
    },
    include: {
      role: true,
    },
  });
};

export const getOwners = async (role_id: number) => {
  return await prisma.users.findMany({
    where: {
      role_id: role_id,
    },
    select: {
      id: true,
      created_at: true,
      agent_code: true,
      email: true,
      balance: true,
      name: true,
      owner_id: true,
      parent_id: true,
      role_id: true,
      updated_at: true,
      phone_number: true,
    },
  });
};

export const getRoleByName = async (name: string) => {
  return await prisma.roles.findUnique({
    where: {
      name: name,
    },
  });
};

export const getAllAgentsDB = async (id: number, roleName: string) => {
  if (!id || !roleName) {
    throw new Error("Invalid input: 'id' and 'roleName' are required.");
  }

  const role = await prisma.roles.findUnique({
    where: {
      name: "agent",
    },
  });

  switch (roleName) {
    case "owner":
      return await prisma.users.findMany({
        where: {
          owner_id: id,
          role_id: role?.id,
        },
        select: {
          id: true,
          created_at: true,
          agent_code: true,
          email: true,
          balance: true,
          name: true,
          owner_id: true,
          parent_id: true,
          role_id: true,
          updated_at: true,
          phone_number: true,
          parent: {
            select: {
              id: true,
              agent_code: true,
              phone_number: true,
              email: true,
              balance: true,
              name: true,
              owner_id: true,
              role_id: true,
            },
          },
        },
      });

    case "agent":
      return await prisma.users.findMany({
        where: {
          parent_id: id,
          role_id: role?.id,
        },
        select: {
          id: true,
          created_at: true,
          agent_code: true,
          email: true,
          balance: true,
          name: true,
          owner_id: true,
          parent_id: true,
          role_id: true,
          updated_at: true,
          phone_number: true,
          parent: {
            select: {
              id: true,
              agent_code: true,
              phone_number: true,
              email: true,
              balance: true,
              name: true,
              owner_id: true,
              role_id: true,
            },
          },
        },
      });

    default:
      return [];
  }
};

export const getPlayersFromDB = async (agent_id: number) => {
  const role = await prisma.roles.findUnique({
    where: {
      name: "player",
    },
  });

  return await prisma.users.findMany({
    where: {
      role_id: role?.id,
      parent_id: agent_id,
    },
    select: {
      id: true,
      created_at: true,
      agent_code: true,
      email: true,
      balance: true,
      name: true,
      owner_id: true,
      parent_id: true,
      role_id: true,
      updated_at: true,
      phone_number: true,
    },
  });
};
