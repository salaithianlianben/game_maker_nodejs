import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRATION, JWT_SECRET } from "../config/authConfig";
import Logger from "./logger";

export interface UserPayload {
  userId: string;
  role: string;
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userPayload: UserPayload) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    Logger.error(error);
    throw new Error("Invalid token");
  }
};
