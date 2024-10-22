import { ExceptionsHandler } from "../core/interceptors";
import { _Response_I } from "../core/interfaces";
import LoggerService from "../core/utils/logger";
import { CreateSchedule_Dto, UpdateSchedule_Dto } from "../dto";
import { OrmContext } from "../orm_database/ormContext";

import { Response } from 'express';

export class ScheduleController {

    logger = new LoggerService('ScheduleController');
    ExceptionsHandler = new ExceptionsHandler();

    listUserSchedules = async (user_auth: any, res: Response) => {

        let _Response: _Response_I;

        try {

            const ormContext = new OrmContext();
            const schedules = await ormContext.schedules.find({
                user: user_auth.sub
            },
                {
                    populate: ['activities']
                });

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'User schedules retrieved successfully',
                data: schedules
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {

            this.logger.error(`[List Schedules] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ScheduleController.listUserSchedules');

        }

    };

    createSchedule = async (dto: CreateSchedule_Dto, user_auth: any, res: Response) => {

        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();
            const newSchedule = ormContext.schedules.create({
                name: dto.name,
                imageUrl: dto.imageUrl,
                user: user_auth.sub
            });

            await ormContext.em.persistAndFlush(newSchedule);

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Schedule created successfully',
                data: newSchedule
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {

            this.logger.error(`[Create Schedule] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ScheduleController.createSchedule');

        }

    };

    getScheduleById = async (scheduleId: string, user_auth: any, res: Response) => {
        let _Response: _Response_I;

        try {

            const ormContext = new OrmContext();
            const schedule = await ormContext.schedules.findOne({
                id: scheduleId,
                user: user_auth.sub

            },
                {
                    populate: ['activities']
                });

            if (!schedule) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Schedule not found',
                    data: null
                };
                throw _Response;
            }

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Schedule found',
                data: schedule
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {

            this.logger.error(`[Get Schedule] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ScheduleController.getScheduleById');

        }
    };

    deleteSchedule = async (scheduleId: string, user_auth: any, res: Response) => {
        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();
            const schedule = await ormContext.schedules.findOne({
                id: scheduleId,
                user: user_auth.sub
            });

            if (!schedule) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Schedule not found',
                    data: null
                };
                throw _Response;
            }

            await ormContext.schedules.nativeDelete(schedule);

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Schedule deleted successfully',
                data: null
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {
            this.logger.error(`[Delete Schedule] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ScheduleController.deleteSchedule');
        }
    };

    updateSchedule = async (scheduleId: string, UpdateScheduleDto: UpdateSchedule_Dto, user_auth: any, res: Response) => {
        let _Response: _Response_I;

        try {
            const ormContext = new OrmContext();
            const schedule = await ormContext.schedules.findOne({
                id: scheduleId,
                user: user_auth.sub
            });

            if (!schedule) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Schedule not found',
                    data: null
                };
                throw _Response;
            }

            ormContext.schedules.assign(schedule, UpdateScheduleDto);

            await ormContext.em.persistAndFlush(schedule);

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Schedule updated successfully',
                data: schedule
            };

            res.status(_Response.statusCode).json(_Response);

        } catch (error) {
            this.logger.error(`[Update Schedule] Error:`, error);
            this.ExceptionsHandler.EmitException(error, res, 'ScheduleController.updateSchedule');
        }
    };

}
