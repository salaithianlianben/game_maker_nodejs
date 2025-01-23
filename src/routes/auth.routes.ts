import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../schema/auth.schema";
import multer from "multer";
import { AuthController } from "../controllers/AuthController";

const authController = new AuthController();

const router = Router();

const upload = multer();

router.post("/register", upload.none(), authController.register);
router.post(
  "/login",
  upload.none(),
  validateRequest(loginSchema),
  authController.login
);

export default router;
