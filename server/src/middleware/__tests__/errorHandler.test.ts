import { errorHandler, AppError } from '../errorHandler';
import { ZodError, z } from 'zod';

describe('Error Handler Middleware', () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  it('deve tratar ZodError', () => {
    const schema = z.object({ name: z.string() });
    try {
      schema.parse({});
    } catch (err) {
      errorHandler(err as ZodError, {} as any, res, jest.fn());
    }

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('deve tratar AppError', () => {
    const err = new AppError('Erro customizado', 403);
    errorHandler(err, {} as any, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro customizado',
      statusCode: 403
    });
  });

  it('deve tratar erro genérico', () => {
    const err = new Error('Erro interno');
    errorHandler(err, {} as any, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

