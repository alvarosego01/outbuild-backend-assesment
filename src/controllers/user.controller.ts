

import { Response } from 'express';
import { ExceptionsHandler } from '../core/interceptors';
import { RegisterUser_Dto } from '../dto/Create-User.dto';

import * as bcrypt from 'bcrypt';
import { OrmContext } from '../orm_database/ormContext';
import { _Response_I, User_Auth_I } from '../core/interfaces';
import { LoginUser_Dto } from '../dto';
import { AuthService } from '../services/auth.service';
import jwt from 'jsonwebtoken';
import { User_Ety } from '../entities/user.entity';


export class UserController {

    // private readonly logger = new Logger('UserService');

    ExceptionsHandler = new ExceptionsHandler();
    authService = new AuthService();

    // this.logger.error(`[Find all users] Error: ${error}`);

    getUser_byId = async (id: string, user_auth: User_Auth_I, res: Response) => {

        let _Response: _Response_I<User_Ety>;

        if (id != user_auth.sub) {

            _Response = {
                ok: false,
                statusCode: 400,
                message: 'Unauthorized access or not exist',
                data: null
            };
            throw _Response;

        }

        try {

            const ormContext = new OrmContext();
            const user = await ormContext.users.findOne({
                id
            });

            if (!user) {

                // this.logger.warn(`[Login user] El usuario ${email} no existe`);
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: `User not found`,
                    data: null
                }
                throw _Response
            }

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'User found',
                data: {
                    ...user,
                    password: '******'

                }
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {

            // this.logger.error(`[ Verify token ] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, res, 'AuthService.verifyToken');

        }

    }

}
