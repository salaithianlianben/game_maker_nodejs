import jwt from "jsonwebtoken";
import { getUserByPhoneNumber, getUserByUsername } from "../models/user.model";
import { comparePassword, generateToken } from "../utils/jwtUtils";

const loginUser = async (identifier: string, password: string) => {
  try {
    const normalizedIdentifier = identifier
      .replace(/\s+/g, "")
      .replace(/[^\w\s]/gi, "");

    let user;
    if (/^\+?\d+$/.test(normalizedIdentifier)) {
      // Find user by phone number
      user = await getUserByPhoneNumber(normalizedIdentifier);
    } else {
      user = await getUserByUsername(normalizedIdentifier);
    }

    if (!user) {
      throw new Error("User not found");
    }

    // Validate the password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken({
      userId: user.id.toString(),
      role: user.role.name,
    });

    return { user, token };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error; // Rethrow the error to be handled at the controller level
  }
};

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      throw new Error("Invalid token");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export { loginUser, verifyToken };
