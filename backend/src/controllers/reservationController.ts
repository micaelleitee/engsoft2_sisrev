import { Request, Response } from "express";
import prisma from "../prismaClient";
import { checkOverlap } from "../services/reservationService";

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { labId, date, startTime, endTime } = req.body;
    const userId = (req as any).user?.userId;

    if (!labId || !date || !startTime || !endTime) return res.status(400).json({ message: "Campos faltando" });

    const start = `${date}T${startTime}:00`;
    const end = `${date}T${endTime}:00`;

    if (new Date(start) >= new Date(end)) return res.status(400).json({ message: "Intervalo inválido" });

    const conflict = await checkOverlap(labId, new Date(start), new Date(end));
    if (conflict) return res.status(409).json({ message: "Horário já reservado" });

    const reservation = await prisma.reservation.create({
      data: {
        labId,
        userId,
        date: new Date(date),
        startTime,
        endTime,
        status: "pending",
      },
    });

    await prisma.reservationHistory.create({
      data: {
        reservationId: reservation.id,
        action: "created",
      },
    });

    // opcional: notificar usuário
    // await notificationService.sendReservationCreated(userId, reservation);

    return res.status(201).json(reservation);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar reserva", error });
  }
};

export const listReservations = async (req: Request, res: Response) => {
  const { labId, userId, date } = req.query;
  const where: any = {};

  if (labId) where.labId = Number(labId);
  if (userId) where.userId = Number(userId);
  if (date) where.date = new Date(String(date));

  const reservations = await prisma.reservation.findMany({ where, include: { user: true, lab: true } });
  return res.json(reservations);
};

export const cancelReservation = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.reservation.update({ where: { id }, data: { status: "cancelled" } });
  await prisma.reservationHistory.create({ data: { reservationId: id, action: "cancelled" } });
  return res.json({ message: "Reserva cancelada" });
};
