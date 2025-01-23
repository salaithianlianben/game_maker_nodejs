import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import {
  dynamicMemoryUpload,
  dynamicUpload,
  ensureFileUploaded,
  saveFile,
} from "../middlewares/upload.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createOwnerSchema } from "../schema/auth.schema";
import multer from "multer";
import { AdminController } from "../controllers/AdminController";
import { transferSchema } from "../schema/transfer.schema";
import { PaymentController } from "../controllers/PaymentController";
import { depositSchema } from "../schema/deposit.schema";
import { UserController } from "../controllers/UserController";
import { updateUserSchema } from "../schema/user.schema";

const upload = multer();
const router = Router();

const paymentController = new PaymentController();
const adminController = new AdminController();
const userController = new UserController();

router.get(
  "/owner",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  adminController.getOwners
);

// Create owner account
router.post(
  "/owner",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  dynamicMemoryUpload().single("logo_path"),
  validateRequest(createOwnerSchema),
  saveFile("owner_sites"),
  adminController.createOwner
);

// Update active/inactive status of owner / agent / player
router.put(
  "/user/:id",
  upload.none(),
  authenticateJWT,
  authorizeRole(["super_admin"]),
  validateRequest(updateUserSchema),
  userController.updateUserInfo
);

// transfer money to owner
router.post(
  "/transfer",
  upload.none(),
  authenticateJWT,
  authorizeRole(["super_admin"]),
  validateRequest(transferSchema),
  paymentController.transfer
);

// self-deposit money to
router.post(
  "/deposit",
  upload.none(),
  authenticateJWT,
  authorizeRole(["super_admin"]),
  validateRequest(depositSchema),
  paymentController.deposit
);

export default router;
