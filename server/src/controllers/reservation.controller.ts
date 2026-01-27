import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const createReservationSchema = z.object({
  laboratoryId: z.string().uuid('ID do laboratório inválido'),
  disciplineId: z.string().uuid('ID da disciplina inválido').optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de início inválida'
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de fim inválida'
  }),
  description: z.string().optional()
});

export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    console.log('[Reservation] Dados recebidos:', req.body);
    const data = createReservationSchema.parse(req.body);
    const professorId = req.userId!;
    console.log('[Reservation] Dados validados:', data, 'Professor ID:', professorId);

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    console.log('[Reservation] Datas processadas:', { startDate, endDate });

    
