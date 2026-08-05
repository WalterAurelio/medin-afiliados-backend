import { Router } from 'express';
import userController from '../../controllers/auth.controller';
import { validateRegister } from '../../middlewares/validateRegister';
import { validateLogin } from '../../middlewares/validateLogin';

const router = Router();

router.post('/register', validateRegister, userController.registerUser);
router.post('/login', validateLogin, userController.login);
router.get('/logout', userController.logout);
router.get('/refresh-token', userController.refresh);

export default router;
