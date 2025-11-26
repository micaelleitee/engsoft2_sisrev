import { Request, Response } from "express";
import prisma from "../prismaClient";
import { checkOverlap } from "../services/reservationService";
import { handleError } from "../utils/handleErrors";
import { sendNotificationToUser } from "../services/notificationService";

/**
 * Cria uma reserva:
 * - recebe labId, startDateTime (ISO string), endDateTime (ISO string)
 * - valida intervalo
 * - checa conflito com checkOverlap
 * - cria reservation + history
 */
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { labId, startDateTime, endDateTime } = req.body;
    const userId = (req as any).user?.userId;

    if (!labId || !startDateTime || !endDateTime) return res.status(400).json({ message: "Campos faltando" });

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return res.status(400).json({ message: "Datas inválidas" });
    if (start >= end) return res.status(400).json({ message: "Intervalo inválido" });

    const conflict = await checkOverlap(labId, start, end);
    if (conflict) return res.status(409).json({ message: "Horário já reservado" });

    const reservation = await prisma.reservation.create({
      data: {
        labId,
        userId,
        startDateTime: start,
        endDateTime: end,
        status: "pending"
      }
    });

    await prisma.reservationHistory.create({
      data: {
        reservationId: reservation.id,
        action: "created"
      }
    });

    // notifica usuário (placeholder)
    await sendNotificationToUser(userId, `Reserva criada (id: ${reservation.id})`);

    return res.status(201).json(reservation);
  } catch (error) {
    return handleError(res, error);
  }
};

export const listReservations = async (req: Request, res: Response) => {
  try {
    const { labId, userId, date } = req.query;
    const where: any = {};

    if (labId) where.labId = Number(labId);
    if (userId) where.userId = Number(userId);
    if (date) {
      const d = new Date(String(date));
      if (!isNaN(d.getTime())) {
        // filtra reservas que começam no mesmo dia (UTC)
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        where.AND = [
          { startDateTime: { gte: d } },
          { startDateTime: { lt: next } }
        ];
      }
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } }, lab: true }
    });

    return res.json(reservations);
  } catch (error) {
    return handleError(res, error);
  }
};

export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.reservation.update({ where: { id }, data: { status: "cancelled" } });
    await prisma.reservationHistory.create({ data: { reservationId: id, action: "cancelled" } });
    return res.json({ message: "Reserva cancelada" });
  } catch (error) {
    return handleError(res, error);
  }
};
