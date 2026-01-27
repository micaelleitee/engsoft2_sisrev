import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAllLaboratories, getLaboratoryById } from '../controllers/laboratory.controller';

export const laboratoryRoutes = Router();

laboratoryRoutes.get('/', authenticate, getAllLaboratories);
laboratoryRoutes.get('/:id', authenticate, getLaboratoryById);


