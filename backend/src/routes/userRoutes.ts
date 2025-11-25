import { Router } from "express";
import { getProfile } from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, getProfile);

export default router;
