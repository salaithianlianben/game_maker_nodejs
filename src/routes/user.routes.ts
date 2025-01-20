import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../schema/auth.schema";
import { login, register } from "../controllers/auth.contoller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRoles } from "../controllers/role.controller";
import { PrismaClient } from "@prisma/client";
import { PaymentGatewayService } from "../services/payment-gateway.service";
import { PaymentGatewayController } from "../controllers/PaymentGatewayController";

const router = Router();

const prisma = new PrismaClient();

const paymentGatewayService = new PaymentGatewayService(prisma);
const paymentgatewayController = new PaymentGatewayController(
  paymentGatewayService
);

router.get("/roles", authenticateJWT, getRoles);

// Payment Gateway
router.get(
  "/payment-gateway",
  authenticateJWT,
  paymentgatewayController.getAllPaymentGateway
);
router.get(
  "/payment-gateway/:id",
  authenticateJWT,
  paymentgatewayController.getById
);

export default router;
