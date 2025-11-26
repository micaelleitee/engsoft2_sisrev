import { Request, Response } from "express";
import prisma from "../prismaClient";
import { handleError } from "../utils/handleErrors";

export const listLabs = async (req: Request, res: Response) => {
  try {
    const labs = await prisma.lab.findMany({
      include: {
        _count: { select: { reservations: true } }
      }
    });
    return res.json(labs);
  } catch (error) {
    return handleError(res, error);
  }
};

export const createLab = async (req: Request, res: Response) => {
  try {
    const { name, capacity, status } = req.body;
    if (!name || !capacity) return res.status(400).json({ message: "Campos faltando" });

    const lab = await prisma.lab.create({ data: { name, capacity, status: status || "available" } });
    return res.status(201).json(lab);
  } catch (error) {
    return handleError(res, error);
  }
};
