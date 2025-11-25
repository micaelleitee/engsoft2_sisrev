import { Router } from "express";
import { createReservation, listReservations, cancelReservation } from "../controllers/reservationController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, listReservations);
router.post("/", authMiddleware, createReservation);
router.put("/:id/cancel", authMiddleware, cancelReservation);

export default router;
