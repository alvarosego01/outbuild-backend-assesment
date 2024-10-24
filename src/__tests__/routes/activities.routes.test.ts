import request from 'supertest';
import { Express } from 'express';
import { server } from '../../server';
import { OrmContext } from '../../orm_database/ormContext';
import { CreateActivity_Dto, BulkCreateActivityDto, UpdateActivity_Dto } from '../../dto';

import * as uuid from 'uuid';


let app: Express;
let token: string;
let userId: string;
let scheduleId: string;
let activityId: string;

const clearActivityData = async () => {
    const ormContext = new OrmContext();
    await ormContext.em.getConnection().execute(`DELETE FROM "activity" WHERE id = ?`, [activityId]);
    await ormContext.em.getConnection().execute(`DELETE FROM "user" WHERE email = ?`, ['test_user_activity@outbuild.com']);
    await ormContext.em.getConnection().execute(`DELETE FROM "schedule" WHERE id = ?`, [scheduleId]);
};

beforeAll(async () => {
    app = await server();

    const user = {
        name: 'John',
        last_name: 'Doe',
        email: 'test_user_activity@outbuild.com',
        password: '_Password123',
    };

    const registerResponse = await request(app).post('/auth/register').send(user);
    userId = registerResponse.body.data.id;

    const loginResponse = await request(app).post('/auth/login').send({
        email: user.email,
        password: user.password,
    });
    token = loginResponse.body.data.token;

    const scheduleResponse = await request(app)
        .post('/schedules/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Schedule', imageUrl: 'test.jpg' });

    scheduleId = scheduleResponse.body.data.id;
});

afterAll(async () => {
    await clearActivityData();
});

describe('Activities Routes', () => {

    describe('POST /:user_id/:schedule_id', () => {

        it('Should add an activity to a schedule successfully', async () => {

            const activity: CreateActivity_Dto = {
                name: 'Test Activity',
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            };

            const response = await request(app)
                .post(`/activities/${userId}/${scheduleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(activity);

            expect(response.status).toBe(201);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Activity added to schedule');
            activityId = response.body.data.id;
        });

        it('Should return an error for invalid DTO', async () => {
            const invalidActivity = {
                name: '',
                description: 'Activity description',
            };

            const response = await request(app)
                .post(`/activities/${userId}/${scheduleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(invalidActivity);

            expect(response.status).toBe(400);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toContain('Validation Dto failed');
        });
    });

    describe('POST /:user_id/:schedule_id/many', () => {
        it('Should add multiple activities to a schedule successfully', async () => {
            const bulkActivities: BulkCreateActivityDto = {
                activities: [
                    {
                        name: 'Test Activity bulk 1',
                        startDate: new Date(),
                        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
                    },
                    {
                        name: 'Test Activity bulk 2',
                        startDate: new Date(),
                        endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
                    }

                ],
            };

            const response = await request(app)
                .post(`/activities/${userId}/${scheduleId}/many`)
                .set('Authorization', `Bearer ${token}`)
                .send(bulkActivities);

            expect(response.status).toBe(201);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Multiple activities added to schedule');
        });

        it('Should return an error for invalid bulk activities DTO', async () => {
            const invalidBulkActivities = {
                activities: [
                    {
                        name: '',
                    },
                ],
            };

            const response = await request(app)
                .post(`/activities/${userId}/${scheduleId}/many`)
                .set('Authorization', `Bearer ${token}`)
                .send(invalidBulkActivities);

            console.log('response.body.message', response.body);

            expect(response.status).toBe(400);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toContain('Validation Dto failed');
        });
    });

    describe('GET /:user_id/:activityId', () => {
        it('Should get activity by ID successfully', async () => {
            const response = await request(app)
                .get(`/activities/${userId}/${activityId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Activity found');
        });

        it('Should return an error when activity is not found', async () => {
            const response = await request(app)
                .get(`/activities/${userId}/${uuid.v4()}`)
                .set('Authorization', `Bearer ${token}`);

            console.log('response activity', response.body);

            expect(response.status).toBe(404);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Activity not found');
        });
    });

    describe('PUT /:user_id/:activityId', () => {
        it('Should update an activity successfully', async () => {
            const updatedActivity: UpdateActivity_Dto = {
                name: 'Test Activity',
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            };


            const response = await request(app)
                .put(`/activities/${userId}/${activityId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedActivity);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Activity updated successfully');
        });

        it('Should return an error for invalid DTO during update', async () => {
            const invalidUpdate = {
                name: '',
            };

            const response = await request(app)
                .put(`/activities/${userId}/${activityId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(invalidUpdate);

            expect(response.status).toBe(400);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toContain('Validation Dto failed');
        });
    });

    describe('DELETE /:user_id/:activityId', () => {
        it('Should delete an activity successfully', async () => {
            const response = await request(app)
                .delete(`/activities/${userId}/${activityId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Activity deleted successfully');
        });

        it('Should return an error when trying to delete a non-existing activity', async () => {
            const response = await request(app)
                .delete(`/activities/${userId}/${uuid.v4()}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Activity not found');
        });
    });
});