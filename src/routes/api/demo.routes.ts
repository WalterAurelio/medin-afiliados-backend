import { Router } from 'express';
import { resetDemoDatabase } from '../../controllers/demo.controller';

const router = Router();

router.post('/reset', resetDemoDatabase);

export default router;
