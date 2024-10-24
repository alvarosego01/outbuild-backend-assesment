import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ExceptionsHandler } from '../interceptors';
import { _Response_I } from '../interfaces';

const exceptionsHandler = new ExceptionsHandler();

export function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {

        let dtoInstance;

        if (Array.isArray(req.body)) {
            dtoInstance = req.body.map((item: any) => plainToInstance(dtoClass, item));
        } else {
            dtoInstance = plainToInstance(dtoClass, req.body);
        }

        const errors: ValidationError[] = await validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true });

        if (errors.length > 0) {
            const validationError = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            const err: _Response_I = exceptionsHandler.EmitException(validationError, 'Validate DTO', 'Validation Dto failed');
            res.status(err.statusCode).json(err);
        } else {
            req.body = dtoInstance;
            next();
        }

    };
}
