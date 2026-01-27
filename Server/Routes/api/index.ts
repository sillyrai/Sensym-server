import {Router} from 'express';
import auth_route from './auth';
import sensors_route from './sensors';

const router = Router();
router.use('/auth', auth_route);
router.use('/sensors', sensors_route);

export default router;