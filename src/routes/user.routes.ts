


import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth_JWT, verifyOwnership } from '../core/middelwares';
import { User_Auth_I } from '../core/interfaces';

const router: Router = Router();
const userController = new UserController();

router.get('/:user_id', [auth_JWT, verifyOwnership], async (req, res, next) => {

    const userId = req.params.user_id;
    await userController.getUser_byId(userId, res);

});

export default router;