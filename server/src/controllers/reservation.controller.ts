import { Request, Response } from 'express';
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

    // Validações
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.log('[Reservation] Datas inválidas');
      throw new AppError('Formato de data inválido', 400);
    }

    if (startDate >= endDate) {
      console.log('[Reservation] Data de início >= data de fim');
      throw new AppError('Data de início deve ser anterior à data de fim', 400);
    }

    if (startDate < new Date()) {
      console.log('[Reservation] Tentativa de reservar para data passada');
      throw new AppError('Não é possível reservar para datas passadas', 400);
    }

    // Verifica se o laboratório existe
    const laboratory = await prisma.laboratory.findUnique({
      where: { id: data.laboratoryId }
    });

    if (!laboratory || !laboratory.isActive) {
      console.log('[Reservation] Laboratório não encontrado ou inativo:', data.laboratoryId);
      throw new AppError('Laboratório não encontrado ou inativo', 404);
    }
    
    console.log('[Reservation] Laboratório encontrado:', laboratory.name);

  // Verifica conflitos de horário
  const conflictingReservation = await prisma.reservation.findFirst({
    where: {
      laboratoryId: data.laboratoryId,
      status: {
        in: ['PENDING', 'CONFIRMED']
      },
      OR: [
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gt: startDate } }
          ]
        },
        {
          AND: [
            { startDate: { lt: endDate } },
            { endDate: { gte: endDate } }
          ]
        },
        {
          AND: [
            { startDate: { gte: startDate } },
            { endDate: { lte: endDate } }
          ]
        }
      ]
    }
  });

    if (conflictingReservation) {
      console.log('[Reservation] Conflito de horário detectado');
      throw new AppError('Já existe uma reserva neste horário', 409);
    }

    console.log('[Reservation] Criando reserva...');
    // Cria a reserva
    const reservation = await prisma.reservation.create({
    data: {
      laboratoryId: data.laboratoryId,
      professorId,
      disciplineId: data.disciplineId,
      startDate,
      endDate,
      description: data.description,
      status: 'PENDING'
    },
    include: {
      laboratory: true,
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
  });
    
    console.log('[Reservation] Reserva criada com sucesso:', reservation.id);
    res.status(201).json(reservation);
  } catch (error) {
    console.error('[Reservation] Erro ao criar reserva:', error);
    throw error;
  }
};

export const getReservations = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const userRole = req.userRole!;

  let reservations;

  if (userRole === 'PROFESSOR') {
    // Professores veem suas próprias reservas
    reservations = await prisma.reservation.findMany({
      where: { professorId: userId },
      include: {
        laboratory: true,
        discipline: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  } else {
    // Alunos veem todas as reservas confirmadas
    reservations = await prisma.reservation.findMany({
      where: {
        status: 'CONFIRMED'
      },
      include: {
        laboratory: true,
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
    });
  }

  res.json(reservations);
};

export const getReservationById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;
  const userRole = req.userRole!;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      laboratory: true,
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
  });

  if (!reservation) {
    throw new AppError('Reserva não encontrada', 404);
  }

  // Verifica permissão
  if (userRole === 'PROFESSOR' && reservation.professorId !== userId) {
    throw new AppError('Acesso negado', 403);
  }

  res.json(reservation);
};

export const updateReservation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;
  const data = req.body;

  const reservation = await prisma.reservation.findUnique({
    where: { id }
  });

  if (!reservation) {
    throw new AppError('Reserva não encontrada', 404);
  }

  if (reservation.professorId !== userId) {
    throw new AppError('Acesso negado', 403);
  }

  if (reservation.status === 'CANCELLED' || reservation.status === 'COMPLETED') {
    throw new AppError('Não é possível atualizar uma reserva cancelada ou concluída', 400);
  }

  const updatedReservation = await prisma.reservation.update({
    where: { id },
    data: {
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.disciplineId !== undefined && { disciplineId: data.disciplineId })
    },
    include: {
      laboratory: true,
      discipline: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  res.json(updatedReservation);
};

export const cancelReservation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  const reservation = await prisma.reservation.findUnique({
    where: { id }
  });

  if (!reservation) {
    throw new AppError('Reserva não encontrada', 404);
  }

  if (reservation.professorId !== userId) {
    throw new AppError('Acesso negado', 403);
  }

  if (reservation.status === 'CANCELLED') {
    throw new AppError('Reserva já está cancelada', 400);
  }

  const cancelledReservation = await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      laboratory: true
    }
  });

  res.json(cancelledReservation);
};

