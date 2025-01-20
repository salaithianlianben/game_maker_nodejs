import { createOwnerSite } from "../models/owner_site.model";
import {
  createUser,
  getOwners,
  getRoleByName,
  getUserByPhoneNumber,
  updateUser,
} from "../models/user.model";
import { NewOwnerInput } from "../schema/auth.schema";
import { generateOwnerUserName } from "../utils/common";
import { hashPassword } from "../utils/jwtUtils";

const fetchOwners = async () => {
  try {
    const role = await getRoleByName("owner");
    if (!role) {
      throw new Error("Role 'owner' not found");
    }
    return await getOwners(role.id);
  } catch (error) {
    console.error("Error fetching owners:", error);
    throw new Error("Failed to fetch owners. Please try again later.");
  }
};

const addOwner = async (new_owner: NewOwnerInput) => {
  try {
    const existingUser = await getUserByPhoneNumber(new_owner.phone_number);
    if (existingUser) {
      throw new Error(
        "Phone number is already existed!. Please use another one."
      );
    }

    const role = await getRoleByName("owner");

    if (!role) {
      throw new Error("Fetching role by role name");
    }

    const hashedPassword = await hashPassword(new_owner.password);
    const owner = await createUser({
      password: hashedPassword,
      name: new_owner.name,
      role_id: role.id,
      phone_number: new_owner.phone_number,
    });

    if (owner) {
      const username = generateOwnerUserName(owner.id);
      const updatedOwner = await updateUser({
        id: owner.id,
        username: username,
      });

      const owner_site = await createOwnerSite({
        owner_id: owner.id,
        site_name: new_owner.site_name,
        site_url: new_owner.site_url,
        logo_path: new_owner.logo_path
      });

      return {
        ...updatedOwner,
        owner_sites: {
          ...owner_site,
        },
      };
    }
  } catch (error) {
    console.error("Error creating owner:", error);
    throw error;
  }
};

export { fetchOwners, addOwner };
