import { ActivitiesController } from '../../controllers/activities.controller';
import { OrmContext } from '../../orm_database/ormContext';
import { CreateActivity_Dto, UpdateActivity_Dto } from '../../dto';
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
    email: 'test_user_activities@outbuild.com',
};

describe('ActivitiesController - addActivityToSchedule', () => {
    let activitiesController: ActivitiesController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        activitiesController = new ActivitiesController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            schedules: {
                findOne: jest.fn(),
            },
            activities: {
                create: jest.fn(),
            },
            em: {
                persistAndFlush: jest.fn(),
            },
        };

        OrmContext.prototype.schedules = ormContextMock.schedules;
        OrmContext.prototype.activities = ormContextMock.activities;
        OrmContext.prototype.em = ormContextMock.em;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add an activity to a schedule successfully', async () => {
        const dto: CreateActivity_Dto = {
            name: 'New Activity',
            startDate: new Date(),
            endDate: new Date(),
        };
        const mockSchedule = { id: 'schedule_id', name: 'Test Schedule' };
        const mockActivity = { id: 'activity_id', name: 'New Activity' };

        ormContextMock.schedules.findOne.mockResolvedValue(mockSchedule);
        ormContextMock.activities.create.mockReturnValue(mockActivity);

        await activitiesController.addActivityToSchedule('schedule_id', dto, userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.findOne).toHaveBeenCalledWith({ id: 'schedule_id', user: 'user_id' });
        expect(ormContextMock.activities.create).toHaveBeenCalledWith({
            name: dto.name,
            startDate: dto.startDate,
            endDate: dto.endDate,
            schedule: mockSchedule,
        });
        expect(ormContextMock.em.persistAndFlush).toHaveBeenCalledWith(mockActivity);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 201,
            message: 'Activity added to schedule',
            data: mockActivity,
        });
    });

    it('should return error when schedule is not found', async () => {
        ormContextMock.schedules.findOne.mockResolvedValue(null);

        const dto: CreateActivity_Dto = {
            name: 'New Activity',
            startDate: new Date(),
            endDate: new Date(),
        };

        await activitiesController.addActivityToSchedule('schedule_id', dto, userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.findOne).toHaveBeenCalledWith({ id: 'schedule_id', user: 'user_id' });
        expect(mockResponse.status).toHaveBeenCalledWith(404);

        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ok: false,
            statusCode: 404,
            message: 'Schedule not found',
            data: null,
        }));
    });

    it('should handle errors during activity creation', async () => {


        ormContextMock.schedules.findOne.mockResolvedValue({ id: 'schedule_id' });
        const error = new Error('Database error');
        ormContextMock.activities.create.mockImplementation(() => { throw error; });

        const dto: CreateActivity_Dto = {
            name: 'New Activity',
            startDate: new Date(),
            endDate: new Date(),
        };

        await activitiesController.addActivityToSchedule('schedule_id', dto, userAuth, mockResponse as Response);


        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ScheduleController.addActivityToSchedule',
            err: expect.any(Error),
        });

    });

});

describe('ActivitiesController - addActivitiesBulk', () => {
    let activitiesController: ActivitiesController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        activitiesController = new ActivitiesController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            schedules: {
                findOne: jest.fn(),
            },
            activities: {
                create: jest.fn(),
            },
            em: {
                persistAndFlush: jest.fn(),
            },
        };

        OrmContext.prototype.schedules = ormContextMock.schedules;
        OrmContext.prototype.activities = ormContextMock.activities;
        OrmContext.prototype.em = ormContextMock.em;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add multiple activities to a schedule successfully', async () => {
        const activities: CreateActivity_Dto[] = [
            {
                name: 'Activity 1',
                startDate: new Date(),
                endDate: new Date(),
            },
            {
                name: 'Activity 2',
                startDate: new Date(),
                endDate: new Date(),
            },
        ];
        const mockSchedule = { id: 'schedule_id', name: 'Test Schedule' };
        const mockActivities = [
            { id: 'activity_1', name: 'Activity 1' },
            { id: 'activity_2', name: 'Activity 2' },
        ];

        ormContextMock.schedules.findOne.mockResolvedValue(mockSchedule);
        ormContextMock.activities.create
            .mockReturnValueOnce(mockActivities[0])
            .mockReturnValueOnce(mockActivities[1]);

        await activitiesController.addActivitiesBulk('schedule_id', activities, userAuth, mockResponse as Response);

        expect(ormContextMock.schedules.findOne).toHaveBeenCalledWith({ id: 'schedule_id', user: 'user_id' });
        expect(ormContextMock.activities.create).toHaveBeenCalledTimes(2);
        expect(ormContextMock.em.persistAndFlush).toHaveBeenCalledWith(mockActivities);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 201,
            message: 'Multiple activities added to schedule',
            data: mockActivities,
        });
    });

    it('should handle errors during bulk activity creation', async () => {

        ormContextMock.schedules.findOne.mockResolvedValue({ id: 'schedule_id' });
        const error = new Error('Database error');
        ormContextMock.activities.create.mockImplementation(() => { throw error; });

        const activities: CreateActivity_Dto[] = [
            {
                name: 'Activity 1',
                startDate: new Date(),
                endDate: new Date(),
            },
            {
                name: 'Activity 2',
                startDate: new Date(),
                endDate: new Date(),
            },
        ];

        await activitiesController.addActivitiesBulk('schedule_id', activities, userAuth, mockResponse as Response);

        expect(activitiesController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            expect.any(Error),
            'ScheduleController.addMultipleActivities'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ScheduleController.addMultipleActivities',
            err: expect.any(Error),
        });
    });

});

describe('ActivitiesController - getActivityById', () => {
    let activitiesController: ActivitiesController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        activitiesController = new ActivitiesController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            activities: {
                findOne: jest.fn(),
            },
        };

        OrmContext.prototype.activities = ormContextMock.activities;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve an activity by ID successfully', async () => {
        const mockActivity = { id: 'activity_id', name: 'Activity 1' };

        ormContextMock.activities.findOne.mockResolvedValue(mockActivity);

        await activitiesController.getActivityById('activity_id', userAuth, mockResponse as Response);

        expect(ormContextMock.activities.findOne).toHaveBeenCalledWith(
            { id: 'activity_id', schedule: { user: 'user_id' } }
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'Activity found',
            data: mockActivity,
        });
    });

    it('should return error when activity is not found', async () => {
        ormContextMock.activities.findOne.mockResolvedValue(null);

        await activitiesController.getActivityById('nonexistent_activity_id', userAuth, mockResponse as Response);

        expect(ormContextMock.activities.findOne).toHaveBeenCalledWith(
            { id: 'nonexistent_activity_id', schedule: { user: 'user_id' } }
        );
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ok: false,
            statusCode: 404,
            message: 'Activity not found',
            data: null,
        }));
    });

    it('should handle errors during activity retrieval', async () => {
        const error = new Error('Database error');
        ormContextMock.activities.findOne.mockRejectedValue(error);

        await activitiesController.getActivityById('activity_id', userAuth, mockResponse as Response);

        expect(activitiesController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            error,
            'ActivityController.getActivityById'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ActivityController.getActivityById',
            err: error,
        });
    });
});

describe('ActivitiesController - updateActivity', () => {
    let activitiesController: ActivitiesController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        activitiesController = new ActivitiesController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            activities: {
                findOne: jest.fn(),
                assign: jest.fn(),
            },
            em: {
                persistAndFlush: jest.fn(),
            },
        };

        OrmContext.prototype.activities = ormContextMock.activities;
        OrmContext.prototype.em = ormContextMock.em;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update an activity successfully', async () => {
        const mockActivity = { id: 'activity_id', name: 'Old Activity' };
        const dto: UpdateActivity_Dto = {
            name: 'Updated Activity',
            startDate: new Date(),
            endDate: new Date(),
        };

        ormContextMock.activities.findOne.mockResolvedValue(mockActivity);

        await activitiesController.updateActivity('activity_id', dto, userAuth, mockResponse as Response);

        expect(ormContextMock.activities.findOne).toHaveBeenCalledWith({
            id: 'activity_id',
            schedule: { user: 'user_id' },
        });
        expect(ormContextMock.activities.assign).toHaveBeenCalledWith(mockActivity, dto);
        expect(ormContextMock.em.persistAndFlush).toHaveBeenCalledWith(mockActivity);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'Activity updated successfully',
            data: mockActivity,
        });
    });


    it('should handle errors during activity update', async () => {
        const error = new Error('Database error');
        ormContextMock.activities.findOne.mockRejectedValue(error);

        const dto: UpdateActivity_Dto = {
            name: 'Updated Activity',
            startDate: new Date(),
            endDate: new Date(),
        };

        await activitiesController.updateActivity('activity_id', dto, userAuth, mockResponse as Response);

        expect(activitiesController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            error,
            'ActivityController.updateActivity'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ActivityController.updateActivity',
            err: error,
        });
    });
});

describe('ActivitiesController - deleteActivity', () => {
    let activitiesController: ActivitiesController;
    let mockResponse: Partial<Response>;
    let ormContextMock: any;

    beforeEach(() => {
        activitiesController = new ActivitiesController();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ormContextMock = {
            activities: {
                findOne: jest.fn(),
                nativeDelete: jest.fn(),
            },
        };

        OrmContext.prototype.activities = ormContextMock.activities;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete an activity successfully', async () => {
        const mockActivity = { id: 'activity_id', name: 'Activity 1' };

        ormContextMock.activities.findOne.mockResolvedValue(mockActivity);

        await activitiesController.deleteActivity('activity_id', userAuth, mockResponse as Response);

        expect(ormContextMock.activities.findOne).toHaveBeenCalledWith({
            id: 'activity_id',
            schedule: { user: 'user_id' },
        });
        expect(ormContextMock.activities.nativeDelete).toHaveBeenCalledWith(mockActivity);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: true,
            statusCode: 200,
            message: 'Activity deleted successfully',
            data: null,
        });
    });



    it('should handle errors during activity deletion', async () => {
        const error = new Error('Database error');
        ormContextMock.activities.findOne.mockRejectedValue(error);

        await activitiesController.deleteActivity('activity_id', userAuth, mockResponse as Response);

        expect(activitiesController.ExceptionsHandler.EmitException).toHaveBeenCalledWith(
            error,
            'ActivityController.deleteActivity'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            ok: false,
            statusCode: 400,
            message: 'Database error',
            data: null,
            context: 'ActivityController.deleteActivity',
            err: error,
        });
    });
});