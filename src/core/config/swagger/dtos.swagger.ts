export const swagger_auth_schemas = {
    LoginUser_Dto: {
        type: 'object',
        description: 'DTO used for logging in a user with their email and password.',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'User email for login',
                example: 'user@example.com',
            },
            password: {
                type: 'string',
                description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                example: 'Password123',
            },
        },
    },
    RegisterUser_Dto: {
        type: 'object',
        description: 'DTO used for registering a new user with basic information and password.',
        required: ['name', 'last_name', 'email', 'password'],
        properties: {
            name: {
                type: 'string',
                description: 'First name of the user',
                example: 'John',
            },
            last_name: {
                type: 'string',
                description: 'Last name of the user',
                example: 'Doe',
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'User email for registration',
                example: 'john.doe@example.com',
            },
            password: {
                type: 'string',
                description: 'Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one number',
                example: 'Password123',
            },
        },
    },
};

const create_schedule_dto = {
    type: 'object',
    description: 'DTO used for creating a new schedule with a name and an optional image URL.',
    required: ['name', 'imageUrl'],
    properties: {
        name: {
            type: 'string',
            minLength: 3,
            description: 'The name of the schedule',
            example: 'My Schedule',
        },
        imageUrl: {
            type: 'string',
            format: 'url',
            description: 'URL of the image representing the schedule',
            example: 'http://example.com/schedule.png',
        },
    },
};

const update_schedule_dto = {
    type: 'object',
    description: 'DTO used for updating an existing schedule with new values for name and image URL.',
    properties: {
        name: {
            type: 'string',
            minLength: 3,
            description: 'The updated name of the schedule',
            example: 'Updated Schedule',
        },
        imageUrl: {
            type: 'string',
            format: 'url',
            description: 'The updated image URL for the schedule',
            example: 'http://example.com/schedule-updated.png',
        },
    },
};

const create_activity_dto = {
    type: 'object',
    description: 'DTO used for creating a new activity with a name, start date, and end date.',
    required: ['name', 'startDate', 'endDate'],
    properties: {
        name: {
            type: 'string',
            minLength: 3,
            description: 'The name of the activity',
            example: 'Morning Workout',
        },
        startDate: {
            type: 'string',
            format: 'date-time',
            description: 'The start date and time of the activity',
            example: '2024-10-10T08:00:00.000Z',
        },
        endDate: {
            type: 'string',
            format: 'date-time',
            description: 'The end date and time of the activity',
            example: '2024-10-10T09:00:00.000Z',
        },
    },
};

const update_activity_dto = {
    type: 'object',
    description: 'DTO used for updating an existing activity with new values for name, start date, and end date.',
    properties: {
        name: {
            type: 'string',
            minLength: 3,
            description: 'The updated name of the activity',
            example: 'Evening Workout',
        },
        startDate: {
            type: 'string',
            format: 'date-time',
            description: 'The updated start date and time of the activity',
            example: '2024-10-10T08:00:00.000Z',
        },
        endDate: {
            type: 'string',
            format: 'date-time',
            description: 'The updated end date and time of the activity',
            example: '2024-10-10T09:00:00.000Z',
        },
    },
};

const bulk_create_activity_dto = {
    type: 'object',
    description: 'DTO used for creating multiple activities in bulk, providing an array of activity objects.',
    properties: {
        activities: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/Create_activity_dto',
            },
            description: 'An array of activities to be created in bulk.',
        },
    },
};

export const swagger_dto = {
    ...swagger_auth_schemas,
    Create_schedule_dto: create_schedule_dto,
    Update_schedule_dto: update_schedule_dto,
    Create_activity_dto: create_activity_dto,
    Update_activity_dto: update_activity_dto,
    Bulk_create_activity_dto: bulk_create_activity_dto
};
