import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllLaboratories = async (req: Request, res: Response) => {
  const laboratories = await prisma.laboratory.findMany({
    where: { isActive: true },
    include: {
      reservations: {
        where: {
          status: {
            in: ['CONFIRMED']
          }
        },
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          discipline: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  res.json(laboratories);
};

export const getLaboratoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const laboratory = await prisma.laboratory.findUnique({
    where: { id },
    include: {
      reservations: {
        where: {
          status: {
            in: ['CONFIRMED']
          }
        },
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          discipline: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { startDate: 'asc' }
      }
    }
  });

  if (!laboratory) {
    return res.status(404).json({ error: 'Laboratório não encontrado' });
  }

  res.json(laboratory);
};

