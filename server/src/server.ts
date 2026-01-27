import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth.routes';
import { laboratoryRoutes } from './routes/laboratory.routes';
import { reservationRoutes } from './routes/reservation.routes';
import { userRoutes } from './routes/user.routes';
import { notificationRoutes } from './routes/notification.routes';
import { disciplineRoutes } from './routes/discipline.routes';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);


