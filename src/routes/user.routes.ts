import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRoles } from "../controllers/role.controller";
import { PaymentGatewayController } from "../controllers/PaymentGatewayController";
import { UserController } from "../controllers/UserController";

const router = Router();
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

export default router;
