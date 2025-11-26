import { Router } from "express";
import { listLabs, createLab } from "../controllers/labController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", listLabs);
router.post("/", authMiddleware, createLab);

export default router;
