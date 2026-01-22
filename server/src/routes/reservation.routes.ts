import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  cancelReservation
} from '../controllers/reservation.controller';

export const reservationRoutes = Router();

reservationRoutes.get('/', authenticate, getReservations);
reservationRoutes.get('/:id', authenticate, getReservationById);
reservationRoutes.post('/', authenticate, authorize('PROFESSOR'), createReservation);
reservationRoutes.put('/:id', authenticate, authorize('PROFESSOR'), updateReservation);
reservationRoutes.delete('/:id', authenticate, authorize('PROFESSOR'), cancelReservation);

