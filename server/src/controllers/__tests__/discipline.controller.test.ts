import request from 'supertest';
import { app } from '../../server'; // Import the app
import { PrismaClient } from '@prisma/client';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    discipline: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('GET /api/disciplines', () => {
  
  beforeEach(() => {
    // Clear all mocks before each test
    (prisma.discipline.findMany as jest.Mock).mockClear();
  });

  it('should return a list of disciplines with their reservations', async () => {
    // Arrange
    const mockDisciplines = [
      {
        id: 'd1',
        name: 'Engenharia de Software',
        reservations: [
          { id: 'r1', description: 'Aula Prática 1' }
        ]
      },
      {
        id: 'd2',
        name: 'Banco de Dados',
        reservations: []
      }
    ];

    (prisma.discipline.findMany as jest.Mock).mockResolvedValue(mockDisciplines);
    
    // Act
    const response = await request(app).get('/api/disciplines');
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockDisciplines);
    expect(prisma.discipline.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.discipline.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
      include: {
        reservations: {
          include: {
            laboratory: true,
            professor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  });

  it('should handle errors and return a 500 status', async () => {
    // Arrange
    const errorMessage = 'Database connection error';
    (prisma.discipline.findMany as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    // Act
    const response = await request(app).get('/api/disciplines');
    
    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao buscar disciplinas' });
  });

});
