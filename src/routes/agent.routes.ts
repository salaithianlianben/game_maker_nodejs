import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { agentPaymentAccountCreation } from "../schema/agent.schema";
import { PrismaClient } from "@prisma/client";
import { PaymentAccountService } from "../services/payment-account.service";
import { PaymentAccountController } from "../controllers/PaymentAccountController";
import multer from "multer";
import { PaymentRequestController } from "../controllers/PaymentRequestController";
import { PaymentRequestService } from "../services/payment-request.service";
import { updateRequestSchema } from "../schema/payment-request.schema";

const prisma = new PrismaClient();

const paymentAccountService = new PaymentAccountService(prisma);
const paymentAccountController = new PaymentAccountController(
  paymentAccountService
);
const paymentRequestSerivce = new PaymentRequestService(prisma);
const paymentRequestController = new PaymentRequestController(
  paymentRequestSerivce
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

router.put(
  "/payment-request/:id",
  upload.none(),
  authenticateJWT,
  authorizeRole(["agent"]),
  validateRequest(updateRequestSchema),
  paymentRequestController.update
);

export default router;
