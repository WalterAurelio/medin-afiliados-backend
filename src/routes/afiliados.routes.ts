import { Router } from 'express';
import afiliadoController from '../controllers/afiliados.controller';

const router = Router();

router.get('/afiliados', afiliadoController.getAfiliado);

export default router;
