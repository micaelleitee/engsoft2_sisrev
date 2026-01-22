import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  return res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { name } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name })
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });

  res.json(user);
};

