import prisma from "../models/prisma";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { User } from "../types/user";
import { UsersAccessLogsService } from "../services/users-access-logs.service";
import { handleErrorResponse } from "../utils/errors";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";

export class AuthController {
  private service: AuthService = new AuthService(prisma);
  private userLogService: UsersAccessLogsService = new UsersAccessLogsService(
    prisma
  );

  private extractClientIp(req: Request): string {
    let clientIp: string | undefined;

    const forwarded = req.headers["x-forwarded-for"];
    if (Array.isArray(forwarded)) {
      clientIp = forwarded[0];
    } else if (typeof forwarded === "string") {
      clientIp = forwarded.split(",")[0].trim();
    }

    if (!clientIp) {
      clientIp = req.socket.remoteAddress || "";
    }

    if (clientIp === "::1") {
      clientIp = "127.0.0.1";
    }

    if (clientIp.startsWith("::ffff:")) {
      clientIp = clientIp.replace("::ffff:", "");
    }

    return clientIp;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { password, name, phone_number, referral_code } = req.body;

      if (!referral_code) {
        sendErrorResponse(res, 400, "referral_code is required for players");
        return;
      }

      const data = await this.service.addPlayer({
        name: name,
        phone_number: phone_number,
        password: password,
        referral_code: referral_code,
      });

      if (data && data.username) {
        const { user, token } = await this.service.loginUser(
          data.username,
          password
        );
        sendSuccessResponse(
          res,
          201,
          "User registered and logged in successfully",
          { user: user as User, token }
        );
        return;
      }

      sendSuccessResponse(res, 201, "User registered successfully", data);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const { user, token } = await this.service.loginUser(username, password);

      const clientIp = this.extractClientIp(req);

      await this.userLogService.createUserLogs({
        user_id: user.id,
        ip_address: clientIp,
      });

      sendSuccessResponse(res, 200, "Login successful", { user: user as User, token });
    } catch (error) {
      handleErrorResponse(error, res);
    }
  };
}
