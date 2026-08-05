import { Router } from 'express';
import { getEspecialidades } from '../controllers/especialidades.controller';

const router = Router();

router.get('/especialidades', getEspecialidades);

export default router;
