import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getNotifications, markAsRead } from '../controllers/notification.controller';

export const notificationRoutes = Router();

notificationRoutes.get('/', authenticate, getNotifications);
notificationRoutes.put('/:id/read', authenticate, markAsRead);

