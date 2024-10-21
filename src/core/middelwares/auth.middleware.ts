




import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/auth.service';
import { _Response_I } from '../interfaces/api_response';

const authService = new AuthService();

export const auth_JWT = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const response = await authService.verifyToken( req.headers.authorization as string );

        if (!response) {
            const resp: _Response_I = {
                ok: false,
                message: 'Unauthorized',
                statusCode: 401
            }
            res.status(resp.statusCode).json(resp);
        }

        req.user = response;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
