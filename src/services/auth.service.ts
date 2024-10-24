import jwt from 'jsonwebtoken';
import { envs } from '../core/config/envs';

export class AuthService {


    generateToken(user: any) {

        const payload = { sub: user.id, email: user.email };
        return jwt.sign(payload, envs.jwt_secret, { expiresIn: '48h' });

    }

    verifyToken(token: string) {

        token = this.extractToken(token);
        return jwt.verify(token, envs.jwt_secret);

    }

    extractToken(token: string): string | null {

        const authHeader = token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        return null;

    }

    // async signJWT(user: any): Promise<string> {
    //     const payload = { sub: user.id, email: user.email };
    //     return jwt.sign(payload, envs.jwt_secret, { expiresIn: '48h' });
    // }

}
