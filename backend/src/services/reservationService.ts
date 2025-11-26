import prisma from "../prismaClient";

/**
 * Verifica se existe sobreposição de horário em um mesmo lab.
 * start e end são objetos Date (start < end).
 * Retorna true se houver conflito.
 */

export async function checkOverlap(labId: number, start: Date, end: Date) {
  const conflict = await prisma.reservation.findFirst({
    where: {
      labId,
      NOT: { status: "cancelled" },
      // overlaps where a reservation starts before 'end' and ends after 'start'
      startDateTime: { lt: end },
      endDateTime: { gt: start }
    }
    ,
    // only need presence check — ids are cheaper than returning full objects
    select: { id: true }
  });

  return Boolean(conflict);
}
