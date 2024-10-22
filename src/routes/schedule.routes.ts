import { Router } from 'express';

import { auth_JWT, validateDto, verifyOwnership } from '../core/middelwares';
import { ScheduleController } from '../controllers/schedule.controller';
import {  CreateScheduleDto } from '../dto';

const router: Router = Router();
const scheduleController = new ScheduleController();

router.get('/', [auth_JWT], async (req, res, next) => {

    await scheduleController.listUserSchedules(req.user, res);

});

router.post('/create', [auth_JWT, validateDto(CreateScheduleDto)], async (req, res, next) => {

    await scheduleController.createSchedule(req.body, req.user, res);

});

router.get('/:user_id/:id', [auth_JWT, verifyOwnership], async (req, res, next) => {

    await scheduleController.getScheduleById(req.params.id, req.user, res);

});

export default router;