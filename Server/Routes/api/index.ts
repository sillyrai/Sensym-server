import {Router} from 'express';
import auth_route from './auth';
import sensors_route from './sensors';
import server_info_route from './serverData';

const router = Router();
router.use('/auth', auth_route);
router.use('/sensors', sensors_route);
router.use('/server', server_info_route);

export default router;