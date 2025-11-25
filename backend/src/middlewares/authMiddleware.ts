import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

interface TokenPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token não enviado" });

  const parts = header.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token inválido" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: "Formato inválido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    (req as any).user = { userId: decoded.userId, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}
