import { _Response_I } from '../../interfaces/api_response';

let resp: _Response_I = {} as _Response_I;

export const auth_paths = {
    '/auth/login': {
        post: {
            summary: 'User Login',
            description: 'Allows users to login with valid credentials and receive a JWT token.',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/LoginUser_Dto',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login successful, token generated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Session started, welcome' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string', example: 'alvaro@outbuild.com' },
                                            name: { type: 'string', example: 'Alvaro' },
                                            last_name: { type: 'string', example: 'Segovia' },
                                            createdAt: { type: 'string', example: '2024-10-22' },
                                            updatedAt: { type: 'string', example: '2024-10-22T00:22:12.787Z' },
                                            id: { type: 'string', example: '77c2a33f-c42e-4d09-9ffb-0dd33b61edaf' },
                                            schedules: { type: 'array', items: { type: 'string' }, example: [] },
                                            token: {
                                                type: 'string',
                                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation Dto failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'Validation Dto failed' },
                                    err: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                property: { type: 'string', example: 'password' },
                                                constraints: {
                                                    type: 'object',
                                                    properties: {
                                                        matches: {
                                                            type: 'string',
                                                            example: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
                                                        },
                                                        isString: { type: 'string', example: 'password must be a string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    data: { type: 'null', example: null },
                                    context: { type: 'string', example: 'Validate DTO' },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found or credentials invalid',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Credentials not valid or user not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'AuthController.login' },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'object', description: 'Detailed error information', example: {} },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/auth/register': {
        post: {
            summary: 'User Registration',
            description: 'Registers a new user into the system.',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/RegisterUser_Dto',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'User created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 201 },
                                    message: { type: 'string', example: 'User created' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string', example: 'alvaro1@outbuild.com' },
                                            password: { type: 'string', example: '********', description: 'Password is hidden for security' },
                                            name: { type: 'string', example: 'Alvaro' },
                                            last_name: { type: 'string', example: 'Segovia' },
                                            createdAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:10:24.372Z' },
                                            updatedAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:10:24.372Z' },
                                            schedules: { type: 'array', items: { type: 'string' }, example: [] },
                                            id: { type: 'string', format: 'uuid', example: '2cc3a1cf-25ef-4f07-8e54-e8b66f713f6f' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation Dto failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'Validation Dto failed' },
                                    err: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                property: { type: 'string', example: 'name' },
                                                constraints: {
                                                    type: 'object',
                                                    properties: {
                                                        maxLength: { type: 'string', example: 'name must be shorter than or equal to 50 characters' },
                                                        minLength: { type: 'string', example: 'name must be longer than or equal to 3 characters' },
                                                        isString: { type: 'string', example: 'name must be a string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    data: { type: 'null', example: null },
                                    context: { type: 'string', example: 'Validate DTO' },
                                },
                            },
                        },
                    },
                },
                409: {
                    description: 'User already exists',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'User with email alvaro1@outbuild.com already exist' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'AuthController.create' },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'object', description: 'Detailed error information', example: {} },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/auth/verify-token': {
        get: {
            summary: 'Verify JWT Token',
            description: 'Verifies the validity of the provided JWT token.',
            tags: ['Authentication'],
            security: [
                {
                    BearerAuth: [],
                },
            ],
            responses: {
                200: {
                    description: 'Token is valid',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Token is valid' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string', example: 'alvaro@outbuild.com' },
                                            id: { type: 'string', format: 'uuid', example: '77c2a33f-c42e-4d09-9ffb-0dd33b61edaf' },
                                            token: {
                                                type: 'string',
                                                description: 'Refreshed JWT token',
                                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI4eio....',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized, invalid or missing token',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

};

const user_paths = {
    '/users/{user_id}': {
        get: {
            summary: 'Get user by ID',
            description: 'Retrieve a user by their ID. Requires Bearer token for authentication.',
            tags: ['Users'],
            security: [
                {
                    BearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to retrieve',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'cbb9f643-4d0b-48e5-b8d8-0b7e6d8476e9',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'User retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'User found' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string', example: 'alvaro@outbuild.com' },
                                            password: {
                                                type: 'string',
                                                description: 'Password is hidden for security reasons',
                                                example: '******',
                                            },
                                            name: { type: 'string', example: 'Alvaro' },
                                            last_name: { type: 'string', example: 'Segovia' },
                                            createdAt: { type: 'string', format: 'date', example: '2024-10-22' },
                                            updatedAt: { type: 'string', format: 'date-time', example: '2024-10-22T00:22:12.787Z' },
                                            id: {
                                                type: 'string',
                                                format: 'uuid',
                                                example: '77c2a33f-c42e-4d09-9ffb-0dd33b61edaf',
                                            },
                                            schedules: {
                                                type: 'array',
                                                description: 'List of user schedules',
                                                items: {
                                                    $ref: '#/components/schemas/Schedule',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized access or invalid token',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 401 },
                                    message: { type: 'string', example: 'Unauthorized access' },
                                    data: { type: 'null', example: null },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

}

export const swagger_schedule_paths = {
    '/schedules/': {
        get: {
            summary: 'List all user schedules',
            description: 'Retrieve all schedules associated with the authenticated user.',
            tags: ['Schedules'],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'A list of schedules',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'User schedules retrieved successfully' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Schedule',
                                        },
                                        description: 'An array of user schedules',
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/schedules/create': {
        post: {
            summary: 'Create a new schedule',
            description: 'Create a new schedule for the authenticated user.',
            tags: ['Schedules'],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Create_schedule_dto' },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Schedule created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 201 },
                                    message: { type: 'string', example: 'Schedule created successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                                format: 'uuid',
                                                example: '860f2375-917f-44b8-9f47-28f21a0e072a',
                                            },
                                            name: { type: 'string', example: 'Project #1' },
                                            imageUrl: {
                                                type: 'string',
                                                format: 'url',
                                                example: 'https://www.nordicinnovation.org/sites/default/files/styles/featured/public/2021-04/Construction%20site%20with%20circular%20buildings%20-%20AdobeStock.jpg',
                                            },
                                            user: {
                                                type: 'string',
                                                format: 'uuid',
                                                example: '77c2a33f-c42e-4d09-9ffb-0dd33b61edaf',
                                            },
                                            createdAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:34:17.999Z' },
                                            updatedAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:34:18.000Z' },
                                            activities: {
                                                type: 'array',
                                                items: { type: 'object' },
                                                description: 'List of activities associated with the schedule',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request (validation error)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'Validation Dto failed' },
                                    err: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                property: { type: 'string', example: 'name' },
                                                constraints: {
                                                    type: 'object',
                                                    properties: {
                                                        minLength: { type: 'string', example: 'name must be longer than or equal to 3 characters' },
                                                        isString: { type: 'string', example: 'name must be a string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    data: { type: 'null', example: null },
                                    context: { type: 'string', example: 'Validate DTO' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/schedules/{user_id}/{schedule_id}': {
        get: {
            summary: 'Get a specific schedule by ID',
            description: 'Retrieve a specific schedule associated with a user by schedule ID.',
            tags: ['Schedules'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the schedule belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'schedule_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the schedule to retrieve',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'cbb9f643-4d0b-48e5-b8d8-0b7e6d8476e9',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Schedule found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Schedule found' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                                format: 'uuid',
                                                example: '860f2375-917f-44b8-9f47-28f21a0e072a',
                                            },
                                            name: { type: 'string', example: 'Project #1' },
                                            imageUrl: {
                                                type: 'string',
                                                format: 'url',
                                                example: 'https://www.nordicinnovation.org/sites/default/files/styles/featured/public/2021-04/Construction%20site%20with%20circular%20buildings%20-%20AdobeStock.jpg',
                                            },
                                            user: {
                                                type: 'string',
                                                format: 'uuid',
                                                example: '77c2a33f-c42e-4d09-9ffb-0dd33b61edaf',
                                            },
                                            createdAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:34:17.999Z' },
                                            updatedAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:34:18.000Z' },
                                            activities: {
                                                type: 'array',
                                                items: { type: 'object' },
                                                description: 'List of activities associated with the schedule',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Schedule not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Schedule not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ScheduleController.getScheduleById' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            summary: 'Update a schedule by ID',
            description: 'Update a specific schedule by its ID.',
            tags: ['Schedules'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the schedule belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'schedule_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the schedule to update',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'cbb9f643-4d0b-48e5-b8d8-0b7e6d8476e9',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Update_schedule_dto' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Schedule updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Schedule updated successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                                format: 'uuid',
                                                example: '860f2375-917f-44b8-9f47-28f21a0e072a',
                                            },
                                            name: { type: 'string', example: 'Schedule edited' },
                                            imageUrl: {
                                                type: 'string',
                                                format: 'url',
                                                example: 'https://www.nordicinnovation.org/sites/default/files/styles/featured/public/2021-04/Construction%20site%20with%20circular%20buildings%20-%20AdobeStock.jpg',
                                            },
                                            user: {
                                                type: 'string',
                                                format: 'uuid',
                                                example: '77c2a33f-c42e-4d09-9ffb-0dd33b61edaf',
                                            },
                                            createdAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:34:17.999Z' },
                                            updatedAt: { type: 'string', format: 'date-time', example: '2024-10-23T12:47:05.260Z' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request (validation error)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'Validation Dto failed' },
                                    err: { type: 'array', items: { type: 'object' } },
                                    data: { type: 'null', example: null },
                                    context: { type: 'string', example: 'Validate DTO' },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Schedule not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Schedule not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ScheduleController.updateSchedule' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            summary: 'Delete a schedule by ID',
            description: 'Delete a specific schedule by its ID.',
            tags: ['Schedules'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the schedule belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'schedule_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the schedule to delete',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'cbb9f643-4d0b-48e5-b8d8-0b7e6d8476e9',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Schedule deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Schedule deleted successfully' },
                                    data: { type: 'null', example: null },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Schedule not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Schedule not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ScheduleController.deleteSchedule' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const swagger_activity_paths = {
    '/activities/{user_id}/{schedule_id}': {
        post: {
            summary: 'Add activity to schedule',
            description: 'Add a new activity to a specific schedule for the authenticated user.',
            tags: ['Activities'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the schedule belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'schedule_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the schedule to which the activity will be added',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'cbb9f643-4d0b-48e5-b8d8-0b7e6d8476e9',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Create_activity_dto' },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Activity added to schedule',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 201 },
                                    message: { type: 'string', example: 'Activity added to schedule' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string', format: 'uuid', example: '620aee6d-9702-40b2-bc14-e7a3420db871' },
                                            name: { type: 'string', example: 'Activity 1 - single' },
                                            startDate: { type: 'string', format: 'date-time', example: '2021-08-01T00:00:00.000Z' },
                                            endDate: { type: 'string', format: 'date-time', example: '2021-08-01T00:00:00.000Z' },
                                            schedule: { $ref: '#/components/schemas/Schedule' },
                                            createdAt: { type: 'string', format: 'date-time', example: '2024-10-23T13:01:26.951Z' },
                                            updatedAt: { type: 'string', format: 'date-time', example: '2024-10-23T13:01:26.951Z' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request (validation error)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'Validation Dto failed' },
                                    err: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                property: { type: 'string', example: 'name' },
                                                constraints: {
                                                    type: 'object',
                                                    properties: {
                                                        minLength: { type: 'string', example: 'name must be longer than or equal to 3 characters' },
                                                        isString: { type: 'string', example: 'name must be a string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    data: { type: 'null', example: null },
                                    context: { type: 'string', example: 'Validate DTO' },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Schedule not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Schedule not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ScheduleController.addActivityToSchedule' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/activities/{user_id}/{schedule_id}/many': {
        post: {
            summary: 'Add multiple activities to schedule',
            description: 'Add multiple activities to a specific schedule for the authenticated user.',
            tags: ['Activities'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the schedule belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'schedule_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the schedule to which the activities will be added',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'cbb9f643-4d0b-48e5-b8d8-0b7e6d8476e9',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Bulk_create_activity_dto' },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Activities added to schedule',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 201 },
                                    message: { type: 'string', example: 'Multiple activities added to schedule' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Activity',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request (validation error)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'Validation Dto failed' },
                                    err: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                property: { type: 'string', example: 'activities' },
                                            },
                                        },
                                    },
                                    data: { type: 'null', example: null },
                                    context: { type: 'string', example: 'Validate DTO' },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Schedule not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Schedule not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ScheduleController.addMultipleActivities' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/activities/{user_id}/{activityId}': {
        get: {
            summary: 'Get activity by ID',
            description: 'Retrieve a specific activity by its ID for the authenticated user.',
            tags: ['Activities'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the activity belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'activityId',
                    in: 'path',
                    required: true,
                    description: 'ID of the activity to retrieve',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'aabbccdd-1234-5678-90ab-0e02b2c3d479',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Activity found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Activity found' },
                                    data: {
                                        $ref: '#/components/schemas/Activity',
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Activity not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Activity not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ActivityController.getActivityById' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            summary: 'Update activity by ID',
            description: 'Update a specific activity by its ID for the authenticated user.',
            tags: ['Activities'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the activity belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'activityId',
                    in: 'path',
                    required: true,
                    description: 'ID of the activity to update',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'aabbccdd-1234-5678-90ab-0e02b2c3d479',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Update_activity_dto' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Activity updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Activity updated successfully' },
                                    data: { $ref: '#/components/schemas/Activity' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request (validation error)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 400 },
                                    message: { type: 'string', example: 'Validation Dto failed' },
                                    err: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                property: { type: 'string', example: 'startDate' },
                                                constraints: {
                                                    type: 'object',
                                                    properties: {
                                                        isDate: { type: 'string', example: 'startDate must be a Date instance' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    data: { type: 'null', example: null },
                                    context: { type: 'string', example: 'Validate DTO' },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Activity not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Activity not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ActivityController.updateActivity' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            summary: 'Delete activity by ID',
            description: 'Delete a specific activity by its ID for the authenticated user.',
            tags: ['Activities'],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'user_id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to whom the activity belongs',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                },
                {
                    name: 'activityId',
                    in: 'path',
                    required: true,
                    description: 'ID of the activity to delete',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: 'aabbccdd-1234-5678-90ab-0e02b2c3d479',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Activity deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: true },
                                    statusCode: { type: 'number', example: 200 },
                                    message: { type: 'string', example: 'Activity deleted successfully' },
                                    data: { type: 'null', example: null },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Activity not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 404 },
                                    message: { type: 'string', example: 'Activity not found' },
                                    data: { type: 'null', example: null },
                                    err: { type: 'null', example: null },
                                    context: { type: 'string', example: 'ActivityController.deleteActivity' },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    statusCode: { type: 'number', example: 401 },
                                    err: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'JsonWebTokenError' },
                                            message: { type: 'string', example: 'jwt must be provided' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean', example: false },
                                    statusCode: { type: 'number', example: 500 },
                                    message: { type: 'string', example: 'An unexpected error occurred' },
                                    data: { type: 'null', example: null },
                                    err: {
                                        type: 'object',
                                        description: 'Detailed error information',
                                        example: {},
                                    },
                                    context: { type: 'string', example: 'ExceptionsHandler' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const swagger_paths = {
    ...user_paths,
    ...auth_paths,
    ...swagger_schedule_paths,
    ...swagger_activity_paths
};

