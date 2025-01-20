import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../schema/auth.schema";
import { login, register } from "../controllers/auth.contoller";
import multer from "multer";

const router = Router();

const upload = multer();

router.post("/register", upload.none(), register);
router.post("/login", upload.none(), validateRequest(loginSchema), login);

export default router;
