


import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth_JWT } from '../core/middelwares';
import { User_Auth_I } from '../core/interfaces';

const router: Router = Router();
const userController = new UserController();


// router.post('/register', validateDto(RegisterUser_Dto), async (req, res, next) => {

//     await userController.create(req.body, res)

// });

router.get('/:id', auth_JWT, async (req, res, next) => {

    // get :id param
    const userId = req.params.id;
    await userController.getUser_byId(userId, req.user as User_Auth_I, res);

});

export default router;