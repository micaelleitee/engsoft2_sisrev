import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../auth.middleware';
import { AppError } from '../errorHandler';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'secret';
  });

  describe('authenticate', () => {
    it('deve negar acesso sem token', () => {
      const req: any = { headers: {} };
      authenticate(req, {} as any, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('deve autenticar com token válido', () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        userId: '1',
        role: 'ALUNO'
      });

      const req: any = {
        headers: { authorization: 'Bearer token' }
      };

      authenticate(req, {} as any, next);

      expect(req.userId).toBe('1');
      expect(req.userRole).toBe('ALUNO');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('deve negar se role não permitido', () => {
      const req: any = { userRole: 'ALUNO' };
      authorize('PROFESSOR')(req, {} as any, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('deve permitir se role correto', () => {
      const req: any = { userRole: 'PROFESSOR' };
      authorize('PROFESSOR')(req, {} as any, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
