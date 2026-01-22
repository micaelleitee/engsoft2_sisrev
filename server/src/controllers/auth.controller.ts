import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(1, 'Nome é obrigatório'),
  role: z.enum(['ALUNO', 'PROFESSOR']).optional()
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    throw error;
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    console.log('[Register] Dados recebidos:', { email: data.email, name: data.name, role: data.role });

    // Validação de email baseado no tipo de usuário
    const emailLower = data.email.toLowerCase().trim();
    let userRole = data.role;
    console.log('[Register] Email processado:', emailLower, 'Role fornecido:', userRole);

    if (!userRole) {
      // Verificar primeiro o mais específico (@aluno.ifce.edu.br)
      if (emailLower.endsWith('@aluno.ifce.edu.br')) {
        userRole = 'ALUNO';
        console.log('[Register] Role determinado automaticamente: ALUNO');
      } else if (emailLower.endsWith('@ifce.edu.br') && !emailLower.endsWith('@aluno.ifce.edu.br')) {
        userRole = 'PROFESSOR';
        console.log('[Register] Role determinado automaticamente: PROFESSOR');
      } else {
        console.log('[Register] Email inválido:', emailLower);
        throw new AppError('Email deve terminar com @aluno.ifce.edu.br ou @ifce.edu.br', 400);
      }
    } else {
      // Validação adicional se o role foi fornecido
      if (userRole === 'ALUNO') {
        if (!emailLower.endsWith('@aluno.ifce.edu.br')) {
          console.log('[Register] Email de aluno inválido:', emailLower);
          throw new AppError('Email de aluno deve terminar com @aluno.ifce.edu.br', 400);
        }
        console.log('[Register] Validação de aluno passou');
      } else if (userRole === 'PROFESSOR') {
        // Para professor, deve terminar com @ifce.edu.br mas NÃO com @aluno.ifce.edu.br
        if (!emailLower.endsWith('@ifce.edu.br') || emailLower.endsWith('@aluno.ifce.edu.br')) {
          console.log('[Register] Email de professor inválido:', emailLower);
          throw new AppError('Email de professor deve terminar com @ifce.edu.br (e não @aluno.ifce.edu.br)', 400);
        }
        console.log('[Register] Validação de professor passou');
      }
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower }
    });

    if (existingUser) {
      console.log('[Register] Email já cadastrado:', emailLower);
      throw new AppError('Email já cadastrado', 409);
    }

    console.log('[Register] Criando usuário com role:', userRole);
    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email: emailLower,
        password: hashedPassword,
        name: data.name,
        role: userRole as 'ALUNO' | 'PROFESSOR'
      }
    });
    
    console.log('[Register] Usuário criado com sucesso:', { id: user.id, email: user.email, role: user.role });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    throw error;
  }
};

