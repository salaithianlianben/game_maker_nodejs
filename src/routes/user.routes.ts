import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRoles } from "../controllers/role.controller";
import { PaymentGatewayController } from "../controllers/PaymentGatewayController";
import { UserController } from "../controllers/UserController";
import multer from "multer";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserLogSchema } from "../schema/user.schema";

const router = Router();
const upload = multer();
const paymentgatewayController = new PaymentGatewayController();
const userController = new UserController();

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

// get Me
router.get("/me", authenticateJWT, userController.getMe);

// create user logs
router.post(
  "/user-log",
  upload.none(),
  authenticateJWT,
  validateRequest(createUserLogSchema),
  userController.createUserLog
);

// get user log
router.get("/user-log/:id", authenticateJWT, userController.getUserLog);

export default router;
