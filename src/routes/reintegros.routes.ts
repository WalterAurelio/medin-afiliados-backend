import { Router } from 'express';
import reintegroController from '../controllers/reintegros.controller';
import { filtroAfiliadoActual } from '../middlewares/filtroAfiliadoActual';
import { validateSchema } from '../middlewares/validateSchema';
import { reintegroSchema } from '../schemas/reintegro.schema';
import { existsModelById } from '../middlewares/genericMiddleware';
import Afiliado from '../models/Afiliado';
import Reintegro from '../models/Reintegro';

const router = Router();

router.get('/reintegros/:idAfiliado', existsModelById(Afiliado, 'idAfiliado'), filtroAfiliadoActual, reintegroController.getAllReintegros);
router.post('/reintegros', validateSchema(reintegroSchema), reintegroController.createReintegro);
router.put('/reintegros/:id', existsModelById(Reintegro), validateSchema(reintegroSchema), reintegroController.updateReintegro);
router.patch('/reintegros/:id', existsModelById(Reintegro), reintegroController.deleteReintegro);
router.post('/reintegros/:id', existsModelById(Reintegro), reintegroController.commentReintegroById);

export default router;
