


import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth_JWT, verifyOwnership } from '../core/middelwares';
import { User_Auth_I } from '../core/interfaces';

const router: Router = Router();
const userController = new UserController();


/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:user_id', [auth_JWT, verifyOwnership], async (req, res, next) => {

    const userId = req.params.user_id;
    await userController.getUser_byId(userId, res);

});

export default router;