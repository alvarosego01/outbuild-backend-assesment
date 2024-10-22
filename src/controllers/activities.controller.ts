import { _Response_I, User_Auth_I } from "../core/interfaces";
import LoggerService from "../core/utils/logger";
import { CreateActivity_Dto, UpdateActivity_Dto } from "../dto";
import { OrmContext } from "../orm_database/ormContext";

import { ExceptionsHandler } from "../core/interceptors";

import { Response } from 'express';

export class ActivitiesController {

    logger = new LoggerService('ActivitiesController');
    ExceptionsHandler = new ExceptionsHandler();


      addActivityToSchedule = async (scheduleId: string, dto: CreateActivity_Dto, user_auth: User_Auth_I, res: Response) => {
        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();
            const schedule = await ormContext.schedules.findOne({
                id: scheduleId,
                user: user_auth.sub
             });

            if (!schedule ) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Schedule not found',
                    data: null
                };
                throw _Response;
            }

            const newActivity = ormContext.activities.create({
                name: dto.name,
                startDate: dto.startDate,
                endDate: dto.endDate,
                schedule
            });

            await ormContext.em.persistAndFlush(newActivity);

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Activity added to schedule',
                data: newActivity
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {
            this.logger.error(`[Add Activity] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ScheduleController.addActivityToSchedule');
        }
    };

    addActivitiesBulk = async (scheduleId: string, activities: CreateActivity_Dto[], user_auth: User_Auth_I, res: Response) => {
        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();
            const schedule = await ormContext.schedules.findOne({
                id: scheduleId,
                user: user_auth.sub
            });

            if (!schedule ) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Schedule not found',
                    data: null
                };
                throw _Response;
            }

            const newActivities = activities.map(activity => ormContext.activities.create({
                name: activity.name,
                startDate: activity.startDate,
                endDate: activity.endDate,
                schedule
            }));

            await ormContext.em.persistAndFlush(newActivities);

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Multiple activities added to schedule',
                data: newActivities
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {
            this.logger.error(`[Add Multiple Activities] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ScheduleController.addMultipleActivities');
        }
    };

    getActivityById = async ( activityId: string, user_auth: User_Auth_I, res: Response) => {

        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();

            const activity = await ormContext.activities.findOne({
                id: activityId,
                schedule: {
                    user: user_auth.sub
                },
            });

            if (!activity) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Activity not found',
                    data: null
                };
                throw _Response;
            }

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Activity found',
                data: activity
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {
            this.logger.error(`[Get Activity] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ActivityController.getActivityById');
        }
    };

    updateActivity = async ( activityId: string, updateActivityDto: UpdateActivity_Dto, user_auth: User_Auth_I, res: Response) => {

        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();

            const activity = await ormContext.activities.findOne({
                id: activityId,
                 schedule: {
                    user: user_auth.sub
                },
            });

            if (!activity) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Activity not found',
                    data: null
                };
                throw _Response;
            }

            ormContext.activities.assign(activity, updateActivityDto);
            await ormContext.em.persistAndFlush(activity);

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Activity updated successfully',
                data: activity
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {
            this.logger.error(`[Update Activity] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ActivityController.updateActivity');
        }
    };

    deleteActivity = async ( activityId: string, user_auth: User_Auth_I, res: Response) => {

        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();

            const activity = await ormContext.activities.findOne({
                id: activityId,
                 schedule: {
                    user: user_auth.sub
                },
            });

            if (!activity) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Activity not found',
                    data: null
                };
                throw _Response;
            }

            await ormContext.activities.nativeDelete(activity);

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Activity deleted successfully',
                data: null
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {
            this.logger.error(`[Delete Activity] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ActivityController.deleteActivity');
        }
    };


}


