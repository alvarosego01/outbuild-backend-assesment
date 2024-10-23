import request from 'supertest';
import { server } from '../../server';
import { Express } from 'express';
import { OrmContext } from '../../orm_database/ormContext';

let app: Express;
let token: string;
let userId: string;

const clearUserData = async () => {
    const ormContext = new OrmContext();
    await ormContext.em.getConnection().execute(`DELETE FROM "user" WHERE email = ?`, ['test_user_2@outbuild.com']);
};

beforeAll(async () => {

    app = await server();
    await clearUserData();

    const registerResponse = await request(app)
        .post('/auth/register')
        .send({
            name: 'John',
            last_name: 'Doe',
            email: 'test_user_2@outbuild.com',
            password: '_Password123',
        });

    userId = registerResponse.body.data.id;

    const loginResponse = await request(app)
        .post('/auth/login')
        .send({
            email: 'test_user_2@outbuild.com',
            password: '_Password123',
        });

    token = loginResponse.body.data.token;
});

afterAll(async () => {
    await clearUserData();

});


describe('User Routes', () => {

    describe('GET /:user_id', () => {
        it('should return user data successfully', async () => {
            const response = await request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id', userId);
            expect(response.body.data).toHaveProperty('email', 'test_user_2@outbuild.com');
        });

        it('should return 401 when ownership is not verified', async () => {
            const response = await request(app)
                .get(`/users/fakeUserId`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized access');
        });

    });
});

