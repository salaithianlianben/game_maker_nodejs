import { Router } from "express";
import {
  createAgent,
  createOwner,
  getAllAgents,
  getOwners,
  getPlayersOfAgent,
} from "../controllers/admin.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { dynamicUpload } from "../middlewares/upload.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createOwnerSchema } from "../schema/auth.schema";
import multer from "multer";

const upload = multer();
const router = Router();

router.get(
  "/owners",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  getOwners
);

router.get(
  "/agents",
  authenticateJWT,
  authorizeRole(["agent", "owner"]),
  getAllAgents
);

router.get("/players", authenticateJWT, getPlayersOfAgent);

router.post(
  "/owner",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  dynamicUpload("owner_sites").single("logo_path"),
  validateRequest(createOwnerSchema),
  createOwner
);

router.post(
  "/agent",
  authenticateJWT,
  authorizeRole(["owner", "agent"]),
  createAgent
);

export default router;
