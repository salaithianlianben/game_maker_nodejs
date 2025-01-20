import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { agentPaymentAccountCreation } from "../schema/agent.schema";
import { PrismaClient } from "@prisma/client";
import { PaymentAccountService } from "../services/payment-account.service";
import { PaymentAccountController } from "../controllers/PaymentAccountController";
import multer from "multer";

const prisma = new PrismaClient();

const paymentAccountService = new PaymentAccountService(prisma);
const paymentAccountController = new PaymentAccountController(
  paymentAccountService
);

const router = Router();
const upload = multer();

router.post(
  "/payment-account",
  upload.none(),
  authenticateJWT,
  authorizeRole(["agent"]),
  validateRequest(agentPaymentAccountCreation),
  paymentAccountController.create
);

router.get(
  "/payment-account/agent/:agentId",
  authenticateJWT,
  authorizeRole(["agent"]),
  paymentAccountController.getByAgentId
);

router.get(
  "/payment-account/:id",
  authenticateJWT,
  authorizeRole(["agent"]),
  paymentAccountController.getById
);

router.delete(
  "/payment-account/:id",
  authenticateJWT,
  authorizeRole(["agent"]),
  paymentAccountController.delete
);

router.put(
  "/payment-account/:id",
  upload.none(),
  authenticateJWT,
  authorizeRole(["agent"]),
  paymentAccountController.update
);

export default router;
