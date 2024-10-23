
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { envs } from './envs';
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Outbuild assessment - Backend',
        },
        servers: [
            {
                url: `http://localhost:${envs.port}`,
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier of the user',
                            example: '12345abcde'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email address of the user',
                            example: 'user@example.com'
                        },
                        password: {
                            type: 'string',
                            description: 'User password (stored in hashed format)',
                            example: 'hashedpassword123'
                        },
                        name: {
                            type: 'string',
                            description: 'First name of the user',
                            example: 'John'
                        },
                        last_name: {
                            type: 'string',
                            description: 'Last name of the user',
                            example: 'Doe'
                        },
                        schedules: {
                            type: 'array',
                            description: 'List of user schedules',
                            items: {
                                $ref: '#/components/schemas/Schedule'
                            }
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                            example: '2023-10-15T13:45:30Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                            example: '2023-10-15T13:45:30Z'
                        }
                    }
                },
                Schedule: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier of the schedule',
                            example: 'schedule123'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the schedule',
                            example: 'Morning Routine'
                        },
                    }
                }
            },
            security: [
            {
                BearerAuth: []
            }
        ]
        }
    },
    apis: ['./src/routes/**/*.ts'],
};



const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
