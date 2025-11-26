import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ message: "Não autorizado" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return res.json(user);
};
