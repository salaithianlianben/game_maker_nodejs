import { Request, Response } from "express";
import { AuthController } from "../../src/controllers/AuthController";
import { AuthService } from "../../src/services/auth.service";
import { UsersAccessLogsService } from "../../src/services/users-access-logs.service";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock('../../src/services/auth.service', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      loginUser: jest.fn(),
      addPlayer: jest.fn()
    }))
  };
});

jest.mock('../../src/services/users-access-logs.service', () => {
  return {
    UsersAccessLogsService: jest.fn().mockImplementation(() => ({
      createUserLogs: jest.fn()
    }))
  };
});

jest.mock('../../src/models/prisma');
jest.mock('../../src/utils/logger');

describe("AuthController", () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUserLogsService: jest.Mocked<UsersAccessLogsService>;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };

    authController = new AuthController();
    
    mockAuthService = (AuthService as jest.Mock).mock.results[0].value;
    mockUserLogsService = (UsersAccessLogsService as jest.Mock).mock.results[0].value;
  });

  describe("login", () => {
    const mockUser = {
      id: 5,
      username: "AD000005",
      name: "SUPER ADMIN",
      phone_number: "0997074279",
      role_id: 1,
      balance: new Decimal("30000.00"),
      is_active: true,
      created_at: new Date("2025-01-18 10:17:50.643"),
    };

    const mockToken = "mock-jwt-token";

    it("should successfully login a user with valid credentials", async () => {
      mockRequest = {
        body: {
          username: "AD000005",
          password: "Admin*1234",
        },
        headers: {
          "x-forwarded-for": "127.0.0.1",
        },
      };

      mockAuthService.loginUser.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: "success",
        message: "Login successful",
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      expect(mockUserLogsService.createUserLogs).toHaveBeenCalledWith({
        user_id: mockUser.id,
        ip_address: "127.0.0.1",
      });
    });

    it("should handle invalid credentials", async () => {
      mockRequest = {
        body: {
          username: "AD000005",
          password: "wrongpassword",
        },
        headers: {},
      };

      const mockError = new Error("Invalid credentials");
      mockAuthService.loginUser.mockRejectedValue(mockError);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        status: "fail",
        message: "Invalid credentials",
        errors: mockError.stack,
        data: null,
      });
    });
  });
});