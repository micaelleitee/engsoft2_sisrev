import { Request, Response } from "express";
import prisma from "../prismaClient";

export const listLabs = async (req: Request, res: Response) => {
  const labs = await prisma.lab.findMany({
    include: { reservations: true },
  });
  return res.json(labs);
};

export const createLab = async (req: Request, res: Response) => {
  try {
    const { name, capacity, status } = req.body;
    if (!name || !capacity) return res.status(400).json({ message: "Campos faltando" });

    const lab = await prisma.lab.create({ data: { name, capacity, status: status || "available" } });
    return res.status(201).json(lab);
  } catch (e) {
    return res.status(500).json({ message: "Erro ao criar laboratório", error: e });
  }
};

