




import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/auth.service';

const authService = new AuthService();

export const auth_JWT = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const response = await authService.verifyToken( req.headers.authorization as string );

        if (response) {
            res.status(200).json(response);
        }

        req.user = response;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
