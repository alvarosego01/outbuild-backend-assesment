import { swagger_dto } from "./dtos.swagger";

const user = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
            example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        },
        email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
        },
        name: {
            type: 'string',
            example: 'John',
        },
        last_name: {
            type: 'string',
            example: 'Doe',
        },
        password: {
            type: 'string',
            description: 'Password is hidden for security reasons',
            example: '******',
        },
        schedules: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/Schedule',
            },
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-10T12:00:00.000Z',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-12T12:00:00.000Z',
        },
    },
};

const schedule_entity = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
            example: 'c16a5f64-5717-4562-b3fc-2c963f66afa6',
        },
        name: {
            type: 'string',
            example: 'Weekly Schedule',
        },
        imageUrl: {
            type: 'string',
            format: 'url',
            example: 'http://example.com/schedule.png',
        },
        user: {
            $ref: '#/components/schemas/User',
        },
        activities: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/Activity',
            },
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-10T12:00:00.000Z',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-12T12:00:00.000Z',
        },
    },
};


const activity_entity = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
            example: 'f2a85f64-5717-4562-b3fc-2c963f66afa6',
        },
        name: {
            type: 'string',
            example: 'Workout Session',
        },
        startDate: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-10T08:00:00.000Z',
        },
        endDate: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-10T09:00:00.000Z',
        },
        schedule: {
            $ref: '#/components/schemas/Schedule',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-10T12:00:00.000Z',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-12T12:00:00.000Z',
        },
    },
};


export const swagger_schemas = {
    User: user,
    Schedule: schedule_entity,
    Activity: activity_entity,
    ...swagger_dto,
};
