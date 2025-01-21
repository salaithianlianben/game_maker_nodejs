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
  ensureFileUploaded,
  saveFile,
} from "../middlewares/upload.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  depositPaymentRequestSchema,
  withdrawPaymentRequestSchema,
} from "../schema/payment-request.schema";
import multer from "multer";
import { transferSchema } from "../schema/transfer.schema";
import { PaymentController } from "../controllers/PaymentController";

const router = Router();
const upload = multer();

const paymentgatewayController = new PaymentGatewayController();

const paymentRequestController = new PaymentRequestController();
const paymentController = new PaymentController();

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

router.post(
  "/withdraw",
  upload.none(),
  authenticateJWT,
  authorizeRole(["player"]),
  validateRequest(withdrawPaymentRequestSchema),
  paymentRequestController.withdraw
);

router.post(
  "/transfer",
  upload.none(),
  authenticateJWT,
  authorizeRole(["super_admin","agent","owner"]),
  validateRequest(transferSchema),
  paymentController.transfer
);

export default router;
