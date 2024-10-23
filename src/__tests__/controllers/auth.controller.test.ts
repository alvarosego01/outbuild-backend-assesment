import { AuthController } from '../../controllers/auth.controller';
import { LoginUser_Dto, RegisterUser_Dto } from '../../dto';
import { OrmContext } from '../../orm_database/ormContext';
import { AuthService } from '../../services/auth.service';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ExceptionsHandler } from '../../core/interceptors';


jest.mock('../../services/auth.service');
jest.mock('../../core/utils/logger');
jest.mock('../../orm_database/ormContext');
jest.mock('bcrypt');

jest.mock('../../core/interceptors/exceptions.handler', () => {
    return {
        ExceptionsHandler: jest.fn().mockImplementation(() => ({

            EmitException: jest.fn().mockImplementation((error, context) => {

                const actualModule = jest.requireActual('../../core/interceptors/exceptions.handler');
                return actualModule.ExceptionsHandler.prototype.EmitException(error, context);

            }),
        })),
    };
});


describe('AuthController - verifyToken', () => {

    let authController: AuthController;
    let mockResponse: Partial<Response>;

    beforeEach(() => {

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

        expect(authController.logger.error).toHaveBeenCalledWith(`[ Verify token ] Error: `, expect.any(Object));

        expect(authController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(error, 'AuthController.verifyToken');

        expect(mockResponse.status).toHaveBeenCalledWith(400);

        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Invalid token',
            data: null,
            context: 'AuthController.verifyToken',
            err: error
        });
    });

});


describe('AuthController - create', () => {
    let authController: AuthController;
    let ormContextMock: any;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        authController = new AuthController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        ormContextMock = {
            users: {
                findOne: jest.fn(),
                create: jest.fn()
            },
            em: {
                persistAndFlush: jest.fn()
            }
        };

        OrmContext.prototype.users = ormContextMock.users;
        OrmContext.prototype.em = ormContextMock.em;

        jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashed_password');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should return error when user already exists', async () => {

        ormContextMock.users.findOne.mockResolvedValue({ email: 'test_user_3@outbuild.com' });

        const dto: RegisterUser_Dto = {
            name: 'John',
            last_name: 'Doe',
            email: 'test_user_3@outbuild.com',
            password: '_Password123'
        };

        mockResponse.status = jest.fn().mockReturnValue(mockResponse);
        mockResponse.json = jest.fn();

        await authController.create(dto, mockResponse as any);

        expect(mockResponse.status).toHaveBeenCalledWith(400);

        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ok: false,
            data: null,
            statusCode: 400,
            message: 'User with email test_user_3@outbuild.com already exist'
        }));

    });


    it('should create a new user successfully', async () => {

        ormContextMock.users.findOne.mockResolvedValue(null);
        ormContextMock.users.create.mockReturnValue({
            name: 'John',
            last_name: 'Doe',
            email: 'test_user_3@outbuild.com',
            password: 'hashed_password'
        });

        const dto: RegisterUser_Dto = {
            name: 'John',
            last_name: 'Doe',
            email: 'test_user_3@outbuild.com',
            password: '_Password123'
        };

        await authController.create(dto, mockResponse as any);

        expect(ormContextMock.users.findOne).toHaveBeenCalledWith({ email: 'test_user_3@outbuild.com' });
        expect(ormContextMock.users.create).toHaveBeenCalledWith({
            name: 'John',
            last_name: 'Doe',
            email: 'test_user_3@outbuild.com',
            password: 'hashed_password'
        });
        expect(ormContextMock.em.persistAndFlush).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 201,
            message: 'User created',
            data: {
                name: 'John',
                last_name: 'Doe',
                email: 'test_user_3@outbuild.com',
                password: '********'
            }
        });
    });

    it('should handle errors during user creation', async () => {
        ormContextMock.users.findOne.mockRejectedValue(new Error('DB error'));

        const dto: RegisterUser_Dto = {
            name: 'John',
            last_name: 'Doe',
            email: 'test_user_3@outbuild.com',
            password: '_Password123'
        };

        await authController.create(dto, mockResponse as any);

        expect(ormContextMock.users.findOne).toHaveBeenCalledWith({ email: 'test_user_3@outbuild.com' });
        expect(mockResponse.status).toHaveBeenCalledWith(400);

    });

});

describe('AuthController - login', () => {
    let authController: AuthController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        authController = new AuthController();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            users: {
                findOne: jest.fn(),
            },
        };

        OrmContext.prototype.users = ormContextMock.users;
    });

    it('should return error when user is not found', async () => {
        ormContextMock.users.findOne.mockResolvedValue(null);

        const dto: LoginUser_Dto = {
            email: 'nonexistent_user@outbuild.com',
            password: '_Password123',
        };

        await authController.login(dto, mockResponse as Response);

        expect(ormContextMock.users.findOne).toHaveBeenCalledWith({ email: 'nonexistent_user@outbuild.com' });
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ok: false,
            statusCode: 404,
            message: 'Credentials not valid or user not found',
        }));
    });

    it('should return error when password is invalid', async () => {
        ormContextMock.users.findOne.mockResolvedValue({ email: 'test_user_3@outbuild.com', password: 'hashed_password' });
        bcrypt.compareSync = jest.fn().mockReturnValue(false);

        const dto: LoginUser_Dto = {
            email: 'test_user_3@outbuild.com',
            password: '_WrongPassword',
        };

        await authController.login(dto, mockResponse as Response);

        expect(bcrypt.compareSync).toHaveBeenCalledWith('_WrongPassword', 'hashed_password');
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ok: false,
            statusCode: 404,
            message: 'Credentials not valid or user not found',
        }));
    });

    it('should login successfully and return a token', async () => {
        const user = { email: 'test_user_3@outbuild.com', password: 'hashed_password' };
        ormContextMock.users.findOne.mockResolvedValue(user);
        bcrypt.compareSync = jest.fn().mockReturnValue(true);

        const token = 'mocked-jwt-token';
        authController.authService.generateToken = jest.fn().mockReturnValue(token);

        const dto: LoginUser_Dto = {
            email: 'test_user_3@outbuild.com',
            password: '_Password123',
        };

        await authController.login(dto, mockResponse as Response);

        expect(bcrypt.compareSync).toHaveBeenCalledWith('_Password123', 'hashed_password');
        expect(authController.authService.generateToken).toHaveBeenCalledWith(user);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ok: true,
            statusCode: 200,
            message: 'Session started, welcome',
            data: expect.objectContaining({
                token: 'mocked-jwt-token',
            }),
        }));

    });

});