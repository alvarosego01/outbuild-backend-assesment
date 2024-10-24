import { AuthController } from '../../controllers/auth.controller';
import { LoginUser_Dto, RegisterUser_Dto } from '../../dto';
import { OrmContext } from '../../orm_database/ormContext';
import { AuthService } from '../../services/auth.service';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ExceptionsHandler } from '../../core/interceptors';
import { UserController } from '../../controllers';
import { User_Ety } from '../../entities';


jest.mock('../../services/auth.service');
jest.mock('../../core/utils/logger');
jest.mock('../../orm_database/ormContext');

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

describe('UserController', () => {
    let userController: UserController;
    let ormContextMock: any;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        userController = new UserController();
        ormContextMock = {
            users: {
                findOne: jest.fn(),
            },
        };
        OrmContext.prototype.users = ormContextMock.users;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return user data successfully', async () => {
        const mockUser: User_Ety = {
            id: 'valid_user_id',
            email: 'test_user_400@outbuild.com',
            password: 'hashed_password',
            schedules: [],
        } as User_Ety;

        ormContextMock.users.findOne.mockResolvedValue(mockUser);

        await userController.getUser_byId('valid_user_id', mockResponse as Response);

        expect(ormContextMock.users.findOne).toHaveBeenCalledWith(
            { id: 'valid_user_id' },
            { populate: ['schedules'] }
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'User found',
            data: {
                ...mockUser,
                password: '******',
            },
        });
    });

    it('should return 404 when user is not found', async () => {
        ormContextMock.users.findOne.mockResolvedValue(null);

        await userController.getUser_byId('nonexistent_user_id', mockResponse as Response);

        expect(ormContextMock.users.findOne).toHaveBeenCalledWith(
            { id: 'nonexistent_user_id' },
            { populate: ['schedules'] }
        );
        expect(mockResponse.status).toHaveBeenCalledWith(404);

           expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                 ok: false,
            statusCode: 404,
            message: 'User not found',
            data: null,
        }));

    });

    it('should handle unexpected errors', async () => {
        const error = new Error('Unexpected error');
        ormContextMock.users.findOne.mockRejectedValue(error);

        await userController.getUser_byId('valid_user_id', mockResponse as Response);

        expect(userController.logger.error).toHaveBeenCalledWith(
            `[ Get user by Id ] Error: `,
            expect.objectContaining({
                ok: false,
                statusCode: 400,
                message: 'Unexpected error',
                data: null,
                context: 'UserController.getUser_byId',
                err: error,
            })
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Unexpected error',
            data: null,
            context: 'UserController.getUser_byId',
            err: error,
        });
    });
});