import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRoles } from "../controllers/role.controller";
import { PaymentGatewayController } from "../controllers/PaymentGatewayController";
import { UserController } from "../controllers/UserController";
import { GameController } from "../controllers/GameController";
// import multer from "multer";
// import { validateRequest } from "../middlewares/validateRequest";
// import { createUserLogSchema } from "../schema/user.schema";

const router = Router();
// const upload = multer();
const paymentgatewayController = new PaymentGatewayController();
const userController = new UserController();
const gameController = new GameController();

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

// get user log
router.get("/user-log/:id", authenticateJWT, userController.getUserLog);

// get game categories
router.get("/game-category", authenticateJWT, gameController.getGameCategories)

// get game category by id
router.get("/game-category/:id", authenticateJWT, gameController.getGameCategory)

// get game category by name
router.get("/game-category/name/:name", authenticateJWT, gameController.getGameCategoryByName)

// get game providers
router.get("/game-provider", authenticateJWT, gameController.getGameProviders)

// get game provider by ID
router.get("/game-provider/:id", authenticateJWT, gameController.getGameProvider)

export default router;
