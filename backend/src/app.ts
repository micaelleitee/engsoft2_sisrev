import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import labRoutes from "./routes/labRoutes";
import reservationRoutes from "./routes/reservationRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/labs", labRoutes);
app.use("/reservation", reservationRoutes);

export default app;
