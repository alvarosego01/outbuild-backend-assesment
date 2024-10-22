import { Router } from "express";
import { ActivitiesController } from "../controllers/activities.controller";
import { auth_JWT, validateDto, verifyOwnership } from "../core/middelwares";
import { BulkCreateActivityDto, CreateActivityDto, UpdateActivityDto } from "../dto";


const router: Router = Router();
const activitiesController = new ActivitiesController();

router.post('/:user_id/:schedule_id', [auth_JWT, verifyOwnership, validateDto(CreateActivityDto)], async (req, res, next) => {

    await activitiesController.addActivityToSchedule(req.params.schedule_id, req.body, req.user, res);

});

router.post('/:user_id/:schedule_id/bulk', [auth_JWT, verifyOwnership, validateDto(BulkCreateActivityDto)], async (req, res, next) => {

    await activitiesController.addActivitiesBulk(req.params.schedule_id, req.body.activities, req.user, res);

});

router.get('/:user_id/:schedule_id/:activityId', [auth_JWT, verifyOwnership], async (req, res, next) => {
    await activitiesController.getActivityById(req.params.schedule_id, req.params.activityId, req.user, res);
});

router.put('/:user_id/:schedule_id/:activityId', [auth_JWT, verifyOwnership, validateDto(UpdateActivityDto)], async (req, res, next) => {
    await activitiesController.updateActivity(req.params.schedule_id, req.params.activityId, req.body, req.user, res);
});

router.delete('/:user_id/:schedule_id/:activityId', [auth_JWT, verifyOwnership], async (req, res, next) => {
    await activitiesController.deleteActivity(req.params.schedule_id, req.params.activityId, req.user, res);
});

export default router;