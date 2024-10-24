

import { server } from '../../server';
import request from 'supertest';
import { OrmContext } from '../../orm_database/ormContext';
import { CreateSchedule_Dto, UpdateSchedule_Dto } from '../../dto';
import { Express } from 'express';

import * as uuid from 'uuid';

let app: Express;
let token: string;
let userId: string;
let scheduleId: string;

const clearData = async () => {
    const ormContext = new OrmContext();
    await ormContext.em.getConnection().execute(`DELETE FROM "user" WHERE email = ?`, ['test_schedule_01@outbuild.com']);
    await ormContext.em.getConnection().execute(`DELETE FROM "schedule" WHERE id = ?`, [scheduleId]);
};

beforeAll(async () => {
    app = await server();

    const registerResponse = await request(app)
        .post('/auth/register')
        .send({
            name: 'John',
            last_name: 'Doe',
            email: 'test_schedule_01@outbuild.com',
            password: '_Password123',
        });

    userId = registerResponse.body.data.id;

    const loginResponse = await request(app)
        .post('/auth/login')
        .send({
            email: 'test_schedule_01@outbuild.com',
            password: '_Password123',
        });

    token = loginResponse.body.data.token;
});

afterAll(async () => {
    await clearData();
});

describe('Schedule Routes', () => {

    describe('GET /schedules', () => {
        it('Should list schedules for authenticated user', async () => {
            const response = await request(app)
                .get('/schedules')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
        });
    });

    describe('POST /schedules/create', () => {
        it('Should create a new schedule for the authenticated user', async () => {
            const schedule: CreateSchedule_Dto = {
                name: 'New Schedule - test',
               imageUrl: 'http://example.com/updated-image.png'
            };

            const response = await request(app)
                .post('/schedules/create')
                .set('Authorization', `Bearer ${token}`)
                .send(schedule);

            expect(response.status).toBe(201);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Schedule created successfully');
            scheduleId = response.body.data.id;
        });

        it('Should return validation error for invalid DTO', async () => {
            const invalidSchedule = {
                name: '',
                imageUrl: 'invalid-url'
            };

            const response = await request(app)
                .post('/schedules/create')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidSchedule);

            expect(response.status).toBe(400);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toContain('Validation Dto failed');
        });
    });

    describe('GET /schedules/:user_id/:schedule_id', () => {
        it('Should get a schedule by ID', async () => {
            const response = await request(app)
                .get(`/schedules/${userId}/${scheduleId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.data).toHaveProperty('id', scheduleId);
        });

        it('Should return 404 if schedule not found', async () => {

            const invalidScheduleId = uuid.v4();

            const response = await request(app)
                .get(`/schedules/${userId}/${invalidScheduleId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Schedule not found');
        });
    });

    describe('PUT /schedules/:user_id/:schedule_id', () => {
        it('Should update a schedule', async () => {
            const updatedSchedule: UpdateSchedule_Dto = {
                name: 'Updated Schedule',
                imageUrl: 'http://example.com/updated-image.png'
            };

            const response = await request(app)
                .put(`/schedules/${userId}/${scheduleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedSchedule);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Schedule updated successfully');
        });

        it('Should return validation error for invalid DTO', async () => {
            const invalidSchedule = {
                name: '',
                imageUrl: 'invalid-url'
            };

            const response = await request(app)
                .put(`/schedules/${userId}/${scheduleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(invalidSchedule);

            expect(response.status).toBe(400);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toContain('Validation Dto failed');
        });
    });

    describe('DELETE /schedules/:user_id/:schedule_id', () => {
        it('Should delete a schedule by ID', async () => {
            const response = await request(app)
                .delete(`/schedules/${userId}/${scheduleId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Schedule deleted successfully');
        });

        it('Should return 404 if schedule not found', async () => {

               const invalidScheduleId = uuid.v4();

            const response = await request(app)
                .delete(`/schedules/${userId}/${invalidScheduleId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Schedule not found');
        });
    });
});
