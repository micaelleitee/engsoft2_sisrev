import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllDisciplines = async (_req: Request, res: Response) => {
  try {
    const disciplines = await prisma.discipline.findMany({
      orderBy: { name: 'asc' },
      include: {
        reservations: {
          include: {
            laboratory: true,
            professor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    return res.json(disciplines);
  } catch (error) {
    console.error('[Discipline] Erro ao buscar disciplinas:', error);
    return res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
};

export const getDisciplineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const discipline = await prisma.discipline.findUnique({
      where: { id },
      

