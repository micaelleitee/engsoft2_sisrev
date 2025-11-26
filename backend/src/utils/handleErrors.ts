import { Response } from "express";

export function handleError(res: Response, error: any) {
  console.error(error);
  return res.status(500).json({ message: "Erro interno", error: String(error) });
}
