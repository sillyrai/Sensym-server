import {Router} from 'express';
import sensors_route from './sensors';
import server_info_route from './serverData';
import profile_route from './profile';

const router = Router();
router.use('/profile', profile_route);
router.use('/sensors', sensors_route);
router.use('/server', server_info_route);

export default router;