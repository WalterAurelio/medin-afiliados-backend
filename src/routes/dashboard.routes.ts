import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { logRequest } from '../middlewares/genericMiddleware';
import { filtroAfiliadoActual } from '../middlewares/filtroAfiliadoActual';

const router = Router();
router.use(logRequest);

router.get('/dashboard/turnos/:idAfiliado',
    filtroAfiliadoActual,
    dashboardController.getLatestTurnos);

router.get('/dashboard/tramites/:idAfiliado', 
    filtroAfiliadoActual,
    dashboardController.getLatestTramites);

export default router;