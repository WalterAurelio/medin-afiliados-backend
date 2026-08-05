import { Router } from 'express';
import { miCuentaController } from '../controllers/miCuenta.controller';

const router = Router();

router.get('/mi-cuenta', miCuentaController.getMiCuenta);

router.post('/mi-cuenta/cbu', miCuentaController.registerCbu);
router.put('/mi-cuenta/cbu', miCuentaController.setMainCbu);
// router.put('/mi-cuenta/cbu-principal/:cbu', miCuentaController.editCbu);
router.put('/mi-cuenta/cbu/:cbu', miCuentaController.editCbu);
router.delete('/mi-cuenta/cbu/:cbu', miCuentaController.deleteCbu);
//router.delete('/mi-cuenta/cbu-principal/:cbu', miCuentaController.eliminarCbu);

export default router;
