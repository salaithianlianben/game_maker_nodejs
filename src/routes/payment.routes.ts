import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { PrismaClient } from "@prisma/client";
import { PaymentGatewayService } from "../services/payment-gateway.service";
import { PaymentGatewayController } from "../controllers/PaymentGatewayController";
import { PaymentRequestService } from "../services/payment-request.service";
import { PaymentRequestController } from "../controllers/PaymentRequestController";
import { authorizeRole } from "../middlewares/role.middleware";
import {
  dynamicMemoryUpload,
  dynamicUpload,
  ensureFileUploaded,
  saveFile,
} from "../middlewares/upload.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { depositPaymentRequestSchema } from "../schema/payment-request.schema";

const router = Router();

const prisma = new PrismaClient();

const paymentGatewayService = new PaymentGatewayService(prisma);
const paymentgatewayController = new PaymentGatewayController(
  paymentGatewayService
);

const paymentRequestService = new PaymentRequestService(prisma);
const paymentRequestController = new PaymentRequestController(
  paymentRequestService
);

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

// Payment Requests
router.post(
  "/deposit",
  authenticateJWT,
  authorizeRole(["player"]),
  dynamicMemoryUpload().single("payment_proof_path"),
  validateRequest(depositPaymentRequestSchema),
  saveFile("request_receipts"),
  //   dynamicUpload("request_receipts").single("payment_proof_path"),
  ensureFileUploaded("payment_proof_path"),
  paymentRequestController.deposit
);

router.get(
  "/payment-request",
  authenticateJWT,
  authorizeRole(["player"]),
  paymentRequestController.getPaymentHistories
);

router.get(
  "/payment-request/:id",
  authenticateJWT,
  authorizeRole(["player"]),
  paymentRequestController.getPaymentRequest
);

export default router;
