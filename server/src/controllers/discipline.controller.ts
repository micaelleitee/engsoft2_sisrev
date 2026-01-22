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
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
};

export const getDisciplineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const discipline = await prisma.discipline.findUnique({
      where: { id },
      // enrollments include removed as DisciplineEnrollment model no longer exists
    });

    if (!discipline) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }

    return res.json(discipline);
  } catch (error) {
    console.error('[Discipline] Erro ao buscar disciplina:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplina' });
  }
};


