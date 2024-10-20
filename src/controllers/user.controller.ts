

import { Request, RequestHandler, Response } from 'express';
import { ExceptionsHandler } from '../core/interceptors';
import { RegisterUser_Dto } from '../dto/Create-User.dto';

import * as bcrypt from 'bcrypt';
import { OrmContext } from '../orm_database/ormContext';
import { _Response_I } from '../core/interfaces';
import { error } from 'console';


export class UserController {

    // private readonly logger = new Logger('UserService');

    ExceptionsHandler = new ExceptionsHandler();

    test: RequestHandler = async (req, res, next) => {

        res.send('Test method');

    }

    // this.logger.error(`[Find all users] Error: ${error}`);
    // return this.ExceptionsHandler.EmitException({hola: '122345'}, res, 'UserController.findAll');

    create: RequestHandler = async (req, res, next) => {

        const {
            email,
            last_name,
            name,
            password
        } = req.body as RegisterUser_Dto;

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

    login: RequestHandler = async (req: Request, res: Response) => {
        const loginUserDto = req.body;
        try {
            const client = { send: (event: string, data: any) => Promise.resolve(data) };
            const result = await client.send('auth.login.user', loginUserDto);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error en el inicio de sesión', error });
        }
    };


}
