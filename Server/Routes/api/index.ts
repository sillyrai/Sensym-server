import {Router} from 'express';
import sensors_route from './_sensors';
import server_info_route from './_serverData';
import profile_route from './_profile';
import login_route from './_login';

const router = Router();
router.use('/profile', profile_route);
router.use('/sensors', sensors_route);
router.use('/server', server_info_route);
router.use('/login', login_route);

export default router;