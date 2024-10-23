
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { envs } from '../envs';
import { swagger_schemas } from './schemas.swagger';
import { swagger_paths } from './paths.swagger';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Outbuild Backend Assesment',
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
            schemas: swagger_schemas,
        },
        paths: swagger_paths,
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/**/*.ts'],
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
