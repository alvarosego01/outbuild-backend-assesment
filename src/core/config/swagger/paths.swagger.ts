
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
                                    token: {
                                        type: 'string',
                                        description: 'JWT token',
                                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found or credentials invalid',
                },
                500: {
                    description: 'Internal server error',
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
                                $ref: '#/components/schemas/RegisterUser_Dto',
                            },
                        },
                    },
                },
                400: {
                    description: 'User already exists',
                },
                500: {
                    description: 'Internal server error',
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
                                    token: {
                                        type: 'string',
                                        description: 'Refreshed JWT token',
                                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid token',
                },
                500: {
                    description: 'Internal server error',
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
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found',
                },
                500: {
                    description: 'Internal server error',
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
                type: 'array',
                items: { $ref: '#/components/schemas/Schedule' },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
              schema: { $ref: '#/components/schemas/Schedule' },
            },
          },
        },
        400: { description: 'Bad request (validation error)' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
              schema: { $ref: '#/components/schemas/Schedule' },
            },
          },
        },
        404: { description: 'Schedule not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
        200: { description: 'Schedule deleted successfully' },
        404: { description: 'Schedule not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
              schema: { $ref: '#/components/schemas/Schedule' },
            },
          },
        },
        400: { description: 'Bad request (validation error)' },
        404: { description: 'Schedule not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
              schema: { $ref: '#/components/schemas/Activity' },
            },
          },
        },
        400: { description: 'Bad request (validation error)' },
        404: { description: 'Schedule not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
              schema: { $ref: '#/components/schemas/Activity' },
            },
          },
        },
        400: { description: 'Bad request (validation error)' },
        404: { description: 'Schedule not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
              schema: { $ref: '#/components/schemas/Activity' },
            },
          },
        },
        404: { description: 'Activity not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
              schema: { $ref: '#/components/schemas/Activity' },
            },
          },
        },
        400: { description: 'Bad request (validation error)' },
        404: { description: 'Activity not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
        200: { description: 'Activity deleted successfully' },
        404: { description: 'Activity not found' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' },
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
