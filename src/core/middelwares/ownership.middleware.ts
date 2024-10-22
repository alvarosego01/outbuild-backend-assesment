import { Request, Response, NextFunction } from 'express';
import { _Response_I, User_Auth_I } from '../interfaces';

export const verifyOwnership = (req: Request, res: Response, next: NextFunction) => {

    const user_id = req.params.user_id;
    const userAuth = req.user as User_Auth_I;

    if (user_id !== userAuth.sub) {

        const _Response: _Response_I = {
            ok: false,
            statusCode: 401,
            message: 'Unauthorized access',
            data: null
        };

        res.status(_Response.statusCode).json(_Response);

    } else {

        next();

    }

};
