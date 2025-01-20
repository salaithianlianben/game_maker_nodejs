import prisma from "../models/prisma";
import {
  generateAgentCode,
  generateAgentUserName,
  generateOwnerUserName,
  generatePlayerUserName,
} from "../utils/common";
import { hashPassword } from "../utils/jwtUtils";

import {
  createUser,
  getAllAgentsDB,
  getPlayersFromDB,
  getRoleByName,
  getUserByAgentCode,
  updateUser,
} from "../models/user.model";
import {
  OwnerType,
} from "../schema/auth.schema";

const addBaseAgent = async ({
  name,
  password,
  phone_number,
  owner_id,
}: {
  name: string;
  password: string;
  phone_number: string;
  owner_id: number;
}) => {
  try {
    const hashedPassword = await hashPassword(password);
    const role = await getRoleByName("agent");
    if (!role) throw new Error("Fail at fetching roles by agent ");
    const user = await createUser({
      password: hashedPassword,
      name: name,
      role_id: role.id,
      phone_number: phone_number,
      owner_id: owner_id,
    });

    if (user) {
      const username = generateAgentUserName(user.id);
      const agentCode = generateAgentCode(user.id);
      return await updateUser({
        id: user.id,
        username: username,
        agent_code: agentCode,
      });
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw new Error("Account registration is failed");
  }
};

const addAgent = async ({
  name,
  phone_number,
  role_id,
  password,
  referral_code,
}: {
  name: string;
  phone_number: string;
  role_id: number;
  password: string;
  referral_code: string;
}) => {
  try {
    const hashedPassword = await hashPassword(password);
    const parent = await getUserByAgentCode(referral_code);
    const user = await createUser({
      password: hashedPassword,
      name: name,
      role_id: role_id,
      phone_number: phone_number,
      parent_id: parent.id,
      owner_id: parent.owner_id,
    });

    if (user) {
      const username = generateAgentUserName(user.id);
      const code = generateAgentCode(user.id);
      return await updateUser({
        id: user.id,
        username: username,
        agent_code: code,
      });
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw new Error("User creation or update failed");
  }
};

const addPlayer = async ({
  name,
  phone_number,
  password,
  referral_code,
  role_id,
}: {
  name: string;
  phone_number: string;
  password: string;
  referral_code: string;
  role_id: number;
}) => {
  try {
    const hashedPassword = await hashPassword(password);
    const parent = await getUserByAgentCode(referral_code);
    const user = await createUser({
      password: hashedPassword,
      name: name,
      role_id: role_id,
      phone_number: phone_number,
      parent_id: parent.id,
    });

    if (user) {
      const username = generatePlayerUserName(user.id);
      return await updateUser({
        id: user.id,
        username: username,
      });
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw new Error("User creation or update failed");
  }
};

const addOwner = async (new_user: OwnerType) => {
  try {
    const hashedPassword = await hashPassword(new_user.password);
    const user = await createUser({
      password: hashedPassword,
      name: new_user.name,
      role_id: new_user.role_id,
      phone_number: new_user.phone_number,
    });

    if (user) {
      const username = generateOwnerUserName(user.id);
      return await updateUser({
        id: user.id,
        username: username,
      });
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw new Error("User creation or update failed");
  }
};

export const isUsernameOrPhoneTaken = async ({
  username,
  phone_number,
}: {
  username?: string;
  phone_number?: string;
}): Promise<boolean> => {
  const user = await prisma.users.findFirst({
    where: {
      OR: [{ username: username }, { phone_number: phone_number }],
    },
  });

  return user !== null;
};

// id can be owner id | parent id
const fetchAllAgents = async ({
  id,
  roleName,
}: {
  id: number;
  roleName: string;
}) => {
  return await getAllAgentsDB(id, roleName);
};

const fetchPlayersOfAgent = async (id: number) => {
  return await getPlayersFromDB(id);
};

export {
  addBaseAgent,
  addAgent,
  addOwner,
  addPlayer,
  fetchAllAgents,
  fetchPlayersOfAgent,
};
