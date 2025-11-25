import prisma from "../prismaClient";

/**
 * Retorna true se houver sobreposição de horário em um mesmo lab
 * start e end são Date objects
 */
export async function checkOverlap(labId: number, start: Date, end: Date) {
  const conflict = await prisma.reservation.findFirst({
    where: {
      labId,
      NOT: { status: "cancelled" },
      AND: [
        { startTime: { lt: end.toISOString().slice(11, 19) } }, // comparando strings HH:MM:SS
        { endTime: { gt: start.toISOString().slice(11, 19) } },
      ],
    },
  });

  return Boolean(conflict);
}
