


import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateDto } from '../core/middelwares/validate-dto.middleware';
import { RegisterUser_Dto } from '../dto/Create-User.dto';
import { LoginUser_Dto } from '../dto';
import { auth_JWT } from '../core/middelwares';

const router: Router = Router();
const userController = new UserController();

router.post('/login', validateDto(LoginUser_Dto), async (req, res, next) => {

    await userController.login(req.body, res)

});

router.post('/register', validateDto(RegisterUser_Dto), async (req, res, next) => {

    await userController.create(req.body, res)

});

router.get('/verify-token', auth_JWT, async (req, res, next) => {

    await userController.verifyToken(req.headers.authorization, res)

});

export default router;