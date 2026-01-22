import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { login } from '../auth.controller'; // Import the login function
import { AppError } from '../../middleware/errorHandler'; // Import AppError

// Mock external modules
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient(); // Initialize the mocked PrismaClient

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockStatus = jest.fn().mockReturnThis(); // Allows chaining .status().json()
    mockJson = jest.fn();
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token and user data on successful login', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';
      const userId = 'user123';
      const userName = 'Test User';
      const userRole = 'ALUNO';
      const mockToken = 'mockJwtToken';

      mockRequest.body = { email, password };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email,
        name: userName,
        password: hashedPassword,
        role: userRole,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      process.env.JWT_SECRET = 'supersecret'; // Set a mock JWT secret

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: email.toLowerCase().trim() },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId, role: userRole },
        'supersecret',
        { expiresIn: '7d' }
      );
      expect(mockJson).toHaveBeenCalledWith({
        token: mockToken,
        user: {
          id: userId,
          email,
          name: userName,
          role: userRole,
        },
      });
      expect(mockStatus).not.toHaveBeenCalled(); // Ensure no error status was set
    });

    it('should throw AppError for invalid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockRequest.body = { email, password };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email,
        name: 'Test User',
        password: 'hashedPassword123',
        role: 'ALUNO',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simulate incorrect password

      // Act & Assert
      await expect(login(mockRequest as Request, mockResponse as Response)).rejects.toThrow(new AppError('Email ou senha inválidos', 401));
      expect(mockStatus).not.toHaveBeenCalled(); // Ensure status is not called before error is thrown
      expect(mockJson).not.toHaveBeenCalled(); // Ensure json is not called before error is thrown
    });

    it('should throw AppError if user not found', async () => {
        // Arrange
        const email = 'nonexistent@example.com';
        const password = 'password123';
  
        mockRequest.body = { email, password };
  
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // Simulate user not found
  
        // Act & Assert
        await expect(login(mockRequest as Request, mockResponse as Response)).rejects.toThrow(new AppError('Email ou senha inválidos', 401));
        expect(mockStatus).not.toHaveBeenCalled();
        expect(mockJson).not.toHaveBeenCalled();
      });
  });
});
