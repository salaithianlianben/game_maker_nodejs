import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import multer from "multer";
import { OwnerController } from "../controllers/OwnerController";
import { baseAgentSchema } from "../schema/agent.schema";
import { PaymentGatewayController } from "../controllers/PaymentGatewayController";
import { paymentGatewaySchema } from "../schema/payment-gateway.schema";
import {
  dynamicMemoryUpload,
  ensureFileUploaded,
  saveFile,
} from "../middlewares/upload.middleware";
import { updateUserSchema } from "../schema/user.schema";

const ownerController = new OwnerController();
const payentGatewayController = new PaymentGatewayController();

const router = Router();
const upload = multer();

// create sub agent account
router.post(
  "/base-agent",
  upload.none(),
  authenticateJWT,
  authorizeRole(["owner"]),
  validateRequest(baseAgentSchema),
  ownerController.createAgent
);

router.get(
  "/base-agent",
  authenticateJWT,
  authorizeRole(["owner"]),
  ownerController.getAgents
)

// create payment gateway
router.post(
  "/payment-gateway",
  authenticateJWT,
  authorizeRole(["owner"]),
  dynamicMemoryUpload().single("logo_path"),
  validateRequest(paymentGatewaySchema),
  saveFile("payment"),
  // ensureFileUploaded("logo_path"),
  payentGatewayController.create
);

// update payment gateway
router.put(
  "/payment-gateway/:id",
  authenticateJWT,
  authorizeRole(["owner"]),
  dynamicMemoryUpload().single("logo_path"),
  saveFile("payment"),
  //   ensureFileUploaded("logo_path"),
  payentGatewayController.update
);

export default router;
