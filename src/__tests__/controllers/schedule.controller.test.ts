import { ScheduleController } from '../../controllers/schedule.controller';
import { OrmContext } from '../../orm_database/ormContext';
import { CreateSchedule_Dto, UpdateSchedule_Dto } from '../../dto';
import { Response } from 'express';
import { ExceptionsHandler } from '../../core/interceptors';
import LoggerService from '../../core/utils/logger';
import { User_Auth_I } from '../../core/interfaces';

jest.mock('../../orm_database/ormContext');
jest.mock('../../core/interceptors');
jest.mock('../../core/utils/logger');

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

const userAuth: User_Auth_I = {
    sub: 'user_id',
    email: 'test_user_3030@outbuild.com'
};

describe('ScheduleController - createSchedule', () => {
    let scheduleController: ScheduleController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        scheduleController = new ScheduleController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            schedules: {
                create: jest.fn(),
            },
            em: {
                persistAndFlush: jest.fn(),
            },
        };

        OrmContext.prototype.schedules = ormContextMock.schedules;
        OrmContext.prototype.em = ormContextMock.em;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new schedule successfully', async () => {
        const dto: CreateSchedule_Dto = { name: 'New Schedule', imageUrl: 'some_url' };
        const mockSchedule = { id: '1', name: 'New Schedule', imageUrl: 'some_url' };

        ormContextMock.schedules.create.mockReturnValue(mockSchedule);



        await scheduleController.createSchedule(dto, userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.create).toHaveBeenCalledWith({
            name: 'New Schedule',
            imageUrl: 'some_url',
            user: 'user_id',
        });
        expect(ormContextMock.em.persistAndFlush).toHaveBeenCalledWith(mockSchedule);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 201,
            message: 'Schedule created successfully',
            data: mockSchedule,
        });
    });

    it('should handle errors during schedule creation', async () => {

        const error = new Error('Database error');
        ormContextMock.schedules.create.mockImplementation(() => { throw error; });

        const dto: CreateSchedule_Dto = { name: 'New Schedule', imageUrl: 'some_url' };



        await scheduleController.createSchedule(dto, userAuth, mockResponse as Response);

        expect(scheduleController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(error, 'ScheduleController.createSchedule');
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ScheduleController.createSchedule',
            err: error
        });

    });

});

describe('ScheduleController - listUserSchedules', () => {
    let scheduleController: ScheduleController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        scheduleController = new ScheduleController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            schedules: {
                find: jest.fn(),
                count: jest.fn(),
            },
        };

        OrmContext.prototype.schedules = ormContextMock.schedules;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve user schedules successfully', async () => {

        const mockSchedules = [
            { id: '1', name: 'Schedule 1', activities: [] },
            { id: '2', name: 'Schedule 2', activities: [] },
        ];

        const totalSchedules = mockSchedules.length;
        ormContextMock.schedules.count.mockResolvedValue(totalSchedules);
        ormContextMock.schedules.find.mockResolvedValue(mockSchedules);

        const pagination = { page: 1, limit: 10 };

        await scheduleController.listUserSchedules(userAuth, pagination, mockResponse as Response);

        expect(ormContextMock.schedules.find).toHaveBeenCalledWith(
            { user: 'user_id' },
            {
                populate: ['activities'],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            }
        );

        expect(ormContextMock.schedules.count).toHaveBeenCalledWith({
            user: 'user_id'
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'User schedules retrieved successfully',
            data: mockSchedules,
            paginator: {
                page: 1,
                limit: 10,
                total: totalSchedules,
                next: false,
                prev: false,
            },
        });
    });

    it('should handle errors during retrieval of user schedules', async () => {
        const error = new Error('Database error');

        ormContextMock.schedules.count.mockResolvedValue(0);
        ormContextMock.schedules.find.mockRejectedValue(error);

        const pagination = { page: 1, limit: 10 };

        await scheduleController.listUserSchedules(userAuth, pagination, mockResponse as Response);

        expect(scheduleController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            error,
            'ScheduleController.listUserSchedules'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ScheduleController.listUserSchedules',
            err: error,
        });
    });

});


describe('ScheduleController - getScheduleById', () => {
    let scheduleController: ScheduleController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        scheduleController = new ScheduleController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            schedules: {
                findOne: jest.fn(),
            },
        };

        OrmContext.prototype.schedules = ormContextMock.schedules;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve a schedule by ID successfully', async () => {
        const mockSchedule = { id: 'schedule_id', name: 'Schedule 1', activities: [] };

        ormContextMock.schedules.findOne.mockResolvedValue(mockSchedule);

        await scheduleController.getScheduleById('schedule_id', userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.findOne).toHaveBeenCalledWith(
            { id: 'schedule_id', user: 'user_id' },
            { populate: ['activities'] }
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'Schedule found',
            data: mockSchedule,
        });
    });

    it('should return error when schedule is not found', async () => {
        ormContextMock.schedules.findOne.mockResolvedValue(null);

        await scheduleController.getScheduleById('nonexistent_schedule_id', userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.findOne).toHaveBeenCalledWith(
            { id: 'nonexistent_schedule_id', user: 'user_id' },
            { populate: ['activities'] }
        );
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ok: false,
            statusCode: 404,
            message: 'Schedule not found',
            data: null,
        }));
    });

    it('should handle errors during schedule retrieval', async () => {
        const error = new Error('Database error');
        ormContextMock.schedules.findOne.mockRejectedValue(error);

        await scheduleController.getScheduleById('schedule_id', userAuth, mockResponse as Response);

        expect(scheduleController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            error,
            'ScheduleController.getScheduleById'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ScheduleController.getScheduleById',
            err: error,
        });
    });

});

describe('ScheduleController - updateSchedule', () => {
    let scheduleController: ScheduleController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        scheduleController = new ScheduleController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            schedules: {
                findOne: jest.fn(),
                assign: jest.fn(),
            },
            em: {
                persistAndFlush: jest.fn(),
            },
        };

        OrmContext.prototype.schedules = ormContextMock.schedules;
        OrmContext.prototype.em = ormContextMock.em;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update a schedule successfully', async () => {

        const mockSchedule = { id: 'schedule_id', name: 'Old Schedule' };

        ormContextMock.schedules.findOne.mockResolvedValue(mockSchedule);

        const dto: UpdateSchedule_Dto = { name: 'New Schedule' };

        await scheduleController.updateSchedule('schedule_id', dto, userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.findOne).toHaveBeenCalledWith({
            id: 'schedule_id',
            user: 'user_id',
        });
        expect(ormContextMock.schedules.assign).toHaveBeenCalledWith(mockSchedule, dto);
        expect(ormContextMock.em.persistAndFlush).toHaveBeenCalledWith(mockSchedule);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'Schedule updated successfully',
            data: mockSchedule,
        });
    });



    it('should handle errors during schedule update', async () => {

        const error = new Error('Database error');
        ormContextMock.schedules.findOne.mockRejectedValue(error);

        const dto: UpdateSchedule_Dto = { name: 'New Schedule' };

        await scheduleController.updateSchedule('schedule_id', dto, userAuth, mockResponse as Response);

        expect(scheduleController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            error,
            'ScheduleController.updateSchedule'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ScheduleController.updateSchedule',
            err: error,
        });

    });
});


describe('ScheduleController - deleteSchedule', () => {
    let scheduleController: ScheduleController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        scheduleController = new ScheduleController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            schedules: {
                findOne: jest.fn(),
                nativeDelete: jest.fn(),
            },
        };

        OrmContext.prototype.schedules = ormContextMock.schedules;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a schedule successfully', async () => {

        const mockSchedule = { id: 'schedule_id', name: 'Schedule 1' };

        ormContextMock.schedules.findOne.mockResolvedValue(mockSchedule);

        await scheduleController.deleteSchedule('schedule_id', userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.findOne).toHaveBeenCalledWith({
            id: 'schedule_id',
            user: 'user_id',
        });
        expect(ormContextMock.schedules.nativeDelete).toHaveBeenCalledWith(mockSchedule);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'Schedule deleted successfully',
            data: null,
        });
    });


    it('should handle errors during schedule deletion', async () => {

        const error = new Error('Database error');
        ormContextMock.schedules.findOne.mockRejectedValue(error);

        await scheduleController.deleteSchedule('schedule_id', userAuth, mockResponse as Response);

        expect(scheduleController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            error,
            'ScheduleController.deleteSchedule'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ScheduleController.deleteSchedule',
            err: error,
        });
    });

});
