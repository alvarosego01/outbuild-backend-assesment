

import { Response } from 'express';
import { ExceptionsHandler } from '../core/interceptors';
import { RegisterUser_Dto } from '../dto/Create-User.dto';

import * as bcrypt from 'bcrypt';
import { OrmContext } from '../orm_database/ormContext';
import { _Response_I } from '../core/interfaces';
import { LoginUser_Dto } from '../dto';
import { AuthService } from '../services/auth.service';
import jwt from 'jsonwebtoken';


export class UserController {

    // private readonly logger = new Logger('UserService');

    ExceptionsHandler = new ExceptionsHandler();
    authService = new AuthService();

    // this.logger.error(`[Find all users] Error: ${error}`);

    async verifyToken(token: string, res: Response) {
        let _Response: _Response_I;

        try {

            const { sub, iat, exp, ...user } = this.authService.verifyToken(token) as jwt.JwtPayload;
            const new_token = this.authService.generateToken(user);

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Token verificado',
                data: {
                    ...user,
                    id: sub,
                    token: new_token
                }
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {

            // this.logger.error(`[ Verify token ] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, res, 'AuthService.verifyToken');

        }

    }



    create = async (RegisterUser_Dto: RegisterUser_Dto, res: Response) => {

        const {
            email,
            last_name,
            name,
            password
        } = RegisterUser_Dto;

        let _Response: _Response_I;

        try {

            const ormContext = new OrmContext();
            const user = await ormContext.users.findOne({
                email
            });

            if (user) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: 400,
                    message: `User with email ${email} already exist`,
                }
                throw _Response;
            }

            const new_user = ormContext.users.create({
                name,
                last_name,
                email,
                password: bcrypt.hashSync(password, 10),
            })

            await ormContext.em.persistAndFlush(new_user);

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'User created',
                data: {
                    ...new_user,
                    password: '********',
                }
            }

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {

            // this.logger.error(`[Register auth] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, res, 'UserController.create');

        }


    }

    login = async (LoginUser_Dto: LoginUser_Dto, res: Response) => {

        const {
            email,
            password
        } = LoginUser_Dto;

        let _Response: _Response_I;

        try {

            const ormContext = new OrmContext();
            const user = await ormContext.users.findOne({
                email
            });

            if (!user) {

                // this.logger.warn(`[Login user] El usuario ${email} no existe`);
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: `User ${email} not found`,
                    data: null
                }
                throw _Response

            }

            const isPassValid = bcrypt.compareSync(password, user.password);

            if (!isPassValid) {
                _Response = {
                    ok: false,
                    statusCode: 400,
                    message: `Password not valid`,
                    data: null
                }
                throw _Response;
            }

            const {
                password: ___,
                ...rest
            } = user;

            const token = this.authService.generateToken(user);

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Session started, welcome',
                data: {
                    ...rest,
                    token
                }
            }

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {

            this.ExceptionsHandler.EmitException(error, res, 'UserController.login');

        }

    };

}
