import {
  getRoleByIdFromDB,
  getRoleByNameFromDB,
  getRolesFromDB,
} from "../models/role.model";
import Logger from "../utils/logger";

const fetchRoleById = async (id: number) => {
  try {
    return await getRoleByIdFromDB(id);
  } catch (error) {
    Logger.error(`Error fetching role by ID: ${id} - ${error}`);
    throw new Error(`Failed to fetch role by ID: ${id}`);
  }
};

const fetchRoleByName = async (name: string) => {
  try {
    return await getRoleByNameFromDB(name);
  } catch (error) {
    Logger.error(`Error fetching role by name: ${name} - ${error}`);
    throw new Error(`Failed to fetch role by name: ${name}`);
  }
};

const fetchRoles = async () => {
  try {
    return await getRolesFromDB();
  } catch (error) {
    Logger.error(`Error fetching roles: ${error}`);
    throw new Error("Failed to fetch roles");
  }
};

export { fetchRoleById, fetchRoleByName, fetchRoles };
