import { Router } from 'express';
import { getAllDisciplines, getDisciplineById } from '../controllers/discipline.controller';

const router = Router();

router.get('/', getAllDisciplines);
router.get('/:id', getDisciplineById);

export { router as disciplineRoutes };


