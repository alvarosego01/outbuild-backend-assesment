

import { Response } from 'express';
import { ExceptionsHandler } from '../core/interceptors';

import { OrmContext } from '../orm_database/ormContext';
import { _Response_I } from '../core/interfaces';
import { AuthService } from '../services/auth.service';
import { User_Ety } from '../entities/user.entity';
import LoggerService from '../core/utils/logger';

export class UserController {

    logger = new LoggerService('UserController');

    ExceptionsHandler = new ExceptionsHandler();
    authService = new AuthService();

    getUser_byId = async (id: string, res: Response) => {

        let _Response: _Response_I<User_Ety>;

        try {

            const ormContext = new OrmContext();
            const user = await ormContext.users.findOne({
                id
            },
             { populate: ['schedules'] }
            );

            if (!user) {

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

            const err: _Response_I = this.ExceptionsHandler.EmitException(error, 'UserController.getUser_byId');
            this.logger.error(`[ Get user by Id ] Error: `, err);
             res.status(err.statusCode).json(err);

        }

    }

}
