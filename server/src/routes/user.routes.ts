import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getProfile, updateProfile } from '../controllers/user.controller';

export const userRoutes = Router();

userRoutes.get('/profile', authenticate, getProfile);
userRoutes.put('/profile', authenticate, updateProfile);


