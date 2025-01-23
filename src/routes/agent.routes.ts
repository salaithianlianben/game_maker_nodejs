import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { agentPaymentAccountCreation, agentSchema } from "../schema/agent.schema";
import { PaymentAccountController } from "../controllers/PaymentAccountController";
import multer from "multer";
import { PaymentRequestController } from "../controllers/PaymentRequestController";
import { updateRequestSchema } from "../schema/payment-request.schema";
import { AgentController } from "../controllers/AgentController";
import { UserController } from "../controllers/UserController";
import { updateUserSchema } from "../schema/user.schema";

const paymentAccountController = new PaymentAccountController();
const paymentRequestController = new PaymentRequestController();
const agentController = new AgentController();
const userController = new UserController();

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

// create sub agent account
router.post(
  "/agent",
  upload.none(),
  authenticateJWT,
  authorizeRole(["agent"]),
  validateRequest(agentSchema),
  agentController.createAgent  
);

// agent list
router.get(
  "/agent",
  authenticateJWT,
  authorizeRole(["agent"]),
  agentController.getAgents
)

// update agent user info
router.put(
  "/agent/:id",
  upload.none(),
  authenticateJWT,
  authorizeRole(["agent","owner"]),
  validateRequest(updateUserSchema),
  userController.updateUserInfo
)

// player list
router.get(
  "/player",
  authenticateJWT,
  authorizeRole(["agent"]),
  agentController.getPlayers
)

// update user info
router.put(
  "/player/:id",
  upload.none(),
  authenticateJWT,
  authorizeRole(["agent", "player"]),
  validateRequest(updateUserSchema),
  userController.updateUserInfo
)

export default router;
