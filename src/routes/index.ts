
import { Router } from 'express';

import userRoutes from './user.routes';
import logRoutes from '../core/utils/logRoutes';

const router: Router = Router();

router.use('/users', userRoutes);

logRoutes(router);

export default router;