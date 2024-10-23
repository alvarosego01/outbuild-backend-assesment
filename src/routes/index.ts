
import { Router } from 'express';

import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import scheduleRoutes from './schedule.routes';
import activitiesRoutes from './activities.routes';

import logRoutes from '../core/utils/logRoutes';

const router: Router = Router();

router.get('/', (req, res) => {
  res.redirect('/docs');
});


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/activities', activitiesRoutes);

logRoutes(router);

export default router;