import { RegisterUser_Dto, LoginUser_Dto } from "../../dto";
import { server } from "../../server";
import request from 'supertest';
import { Express } from 'express';
import { OrmContext } from "../../orm_database/ormContext";

let app: Express;
let token: string;
let userId: string;

const blank_data = async () => {

    const ormContext = new OrmContext();
    await ormContext.em.getConnection().execute(`DELETE FROM "user" WHERE email = ?`, ['test_user@outbuild.com']);

};


beforeAll(async () => {
    app = await server();
    await blank_data();
});

afterAll(async () => {
    await blank_data();

});

describe('Auth Routes', () => {

    //  User registration tests
    describe('POST /auth/register', () => {

        it('Should register a user successfully', async () => {

            const user: RegisterUser_Dto = {
                name: 'John',
                last_name: 'Doe',
                email: 'test_user@outbuild.com',
                password: '_Password123',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(user);

            expect(response.status).toBe(201);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('User created');

            userId = response.body.data.id;
        });

        it('Should return an error when the DTO is invalid', async () => {
            const user = {
                name: 'Jo',
                last_name: 'D',
                email: 'invalid-email',
                password: 'pass',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(user);

            expect(response.status).toBe(400);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toContain('Validation Dto failed');
        });
    });

    //   User login tests
    describe('POST /auth/login', () => {
        it('Should login a user successfully', async () => {

            const loginData: LoginUser_Dto = {
                email: 'test_user@outbuild.com',
                password: '_Password123',
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Session started, welcome');
            expect(response.body.data).toHaveProperty('token');

            token = response.body.data.token;
        });

        it('Should return an error for invalid credentials', async () => {
            const loginData: LoginUser_Dto = {
                email: 'fake_user@outbuild.com',
                password: 'Atest_12345',
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData);

            expect(response.status).toBe(404);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Credentials not valid or user not found');
        });
    });

    //   Token verification tests
    describe('GET /auth/verify-token', () => {
        it('Should verify a valid token successfully', async () => {

            const response = await request(app)
                .get('/auth/verify-token')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.message).toBe('Token is valid');
            expect(response.body.data).toHaveProperty('token');
        });

        it('Should return an error for an invalid token', async () => {
            const invalidToken = 'Bearer invalidTokenHere';

            const response = await request(app)
                .get('/auth/verify-token')
                .set('Authorization', invalidToken);

            expect(response.status).toBe(401);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Unauthorized');
        });
    });

});