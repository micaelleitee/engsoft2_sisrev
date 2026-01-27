import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { unreadOnly } = req.query;

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly === 'true' && { isRead: false })
    },
    include: {
      reservation: {
        include: {
          laboratory: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json(notifications);
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  const notification = await prisma.notification.findUnique({
    where: { id }
  });

  if (!notification || notification.userId !== userId) {
    return res.status(404).json({ error: 'Notificação não encontrada' });
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });

  return res.json(updated);
};


