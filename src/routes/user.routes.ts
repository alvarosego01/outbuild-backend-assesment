


import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateDto } from '../core/middelwares/validate-dto.middleware';
import { RegisterUser_Dto } from '../dto/Create-User.dto';

const router: Router = Router();
const userController = new UserController();

router.post('/login',  userController.login);
router.post('/register', validateDto(RegisterUser_Dto), userController.create);
// router.post('/register', userController.create);
router.post('/test',  userController.test);

// router.post('/login', loginUser);

// router.get('/verify', authMiddleware, verifyUser);


export default router;