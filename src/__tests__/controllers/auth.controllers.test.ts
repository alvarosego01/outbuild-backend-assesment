import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('../../services/auth.service');
jest.mock('../../core/utils/logger');
jest.mock('../../core/interceptors/exceptions.handler');


describe('AuthController - verifyToken', () => {

    let authController: AuthController;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        // Mock AuthService, LoggerService and ExceptionsHandler
        authController = new AuthController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should verify the token successfully', async () => {

        const tokenPayload = { sub: '123', name: 'John Doe', iat: 1600000000, exp: 1600003600 };
        (authController.authService.verifyToken as jest.Mock).mockResolvedValue(tokenPayload);
        (authController.authService.generateToken as jest.Mock).mockResolvedValue('newTokenHere');

        const token = 'validToken';

        await authController.verifyToken(token, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'Token is valid',
            data: {
                name: 'John Doe',
                id: '123',
                token: 'newTokenHere'
            }
        });
    });

    it('should handle errors when verifying the token', async () => {

        const error = new Error('Invalid token');
        (authController.authService.verifyToken as jest.Mock).mockRejectedValue(error);

        const token = 'invalidToken';

        await authController.verifyToken(token, mockResponse as Response);

        expect(authController.logger.error).toHaveBeenCalledWith(`[ Verify token ] Error: `, error);
        expect(authController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(error, mockResponse, 'AuthController.verifyToken');
    });

});
