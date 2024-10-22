


import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ExceptionsHandler } from '../interceptors/exceptions.handler';

const exceptionsHandler = new ExceptionsHandler();

export function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {


        const dtoInstance = plainToInstance(dtoClass, req.body);

        console.log('dtoInstance', dtoInstance);

        const errors: ValidationError[] = await validate(dtoInstance);

        if (errors.length > 0) {

            const validationError = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                })
            );

            return exceptionsHandler.EmitException(validationError, res, 'Validate DTO');

        }

        req.body = dtoInstance;
        next();
    };
}
