import { Router } from "express";
import { listLabs, createLab } from "../controllers/labController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", listLabs);
// criar lab só pra admin (exemplo): auth middleware + check role
router.post("/", authMiddleware, createLab);

export default router;
