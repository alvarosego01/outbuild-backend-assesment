import { Router } from 'express';

import { auth_JWT, paginator, validateDto, verifyOwnership } from '../core/middelwares';
import { ScheduleController } from '../controllers/schedule.controller';
import { CreateSchedule_Dto, UpdateSchedule_Dto } from '../dto';

const router: Router = Router();
const scheduleController = new ScheduleController();

router.get('/', [auth_JWT, paginator], async (req, res, next) => {

    const { page, limit } = req.query;
    const pagination = { page, limit };
    await scheduleController.listUserSchedules(req.user, pagination, res);

});

router.post('/create', [auth_JWT, validateDto(CreateSchedule_Dto)], async (req, res, next) => {

    await scheduleController.createSchedule(req.body, req.user, res);

});

router.get('/:user_id/:schedule_id', [auth_JWT, verifyOwnership], async (req, res, next) => {

    await scheduleController.getScheduleById(req.params.schedule_id, req.user, res);

});

router.delete('/:user_id/:schedule_id', [auth_JWT, verifyOwnership], async (req, res, next) => {

    await scheduleController.deleteSchedule(req.params.schedule_id, req.user, res);

});

router.put('/:user_id/:schedule_id', [auth_JWT, validateDto(UpdateSchedule_Dto)], async (req, res, next) => {

    await scheduleController.updateSchedule(req.params.schedule_id, req.body, req.user, res);

});

export default router;