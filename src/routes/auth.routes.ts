


import { Router } from 'express';
import { validateDto } from '../core/middelwares/validate-dto.middleware';
import { RegisterUser_Dto } from '../dto/Create-User.dto';
import { LoginUser_Dto } from '../dto';
import { auth_JWT } from '../core/middelwares';
import { AuthController } from '../controllers/auth.controller';

const router: Router = Router();
const authController = new AuthController();

router.post('/login', validateDto(LoginUser_Dto), async (req, res, next) => {

    await authController.login(req.body, res)

});

router.post('/register', validateDto(RegisterUser_Dto), async (req, res, next) => {

    await authController.create(req.body, res)

});

router.get('/verify-token', auth_JWT, async (req, res, next) => {

    await authController.verifyToken(req.headers.authorization, res)

});

export default router;