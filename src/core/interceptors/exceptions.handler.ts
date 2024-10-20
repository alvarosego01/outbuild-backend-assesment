import { Response } from 'express';
import { _Response_I } from '../interfaces';

export class ExceptionsHandler {

    constructor() {}

    EmitException(error: any, res: Response, context?: string) {
        if (this.isResponseStructure(error?.error)) {
             res.status(error.statusCode || 500).json({
                ...error.error,
                context: context || 'ExceptionsHandler'
            });
        } else {
            const response: _Response_I = {
                ok: false,
                statusCode: error.statusCode || 400,
                message: error.message || 'An unexpected error occurred',
                err: error,
                data: null,
                context: context || 'ExceptionsHandler'
            };
             res.status(response.statusCode).json(response);
        }
    }

    isResponseStructure(obj: any): obj is _Response_I {
        return (
            typeof obj === 'object' &&
            obj !== null &&
            (typeof obj.ok === 'boolean' || obj.ok === undefined) &&
            (typeof obj.statusCode === 'number' || obj.statusCode === undefined) &&
            (typeof obj.path === 'string' || obj.path === undefined) &&
            (obj.data !== undefined) &&
            (typeof obj.message === 'string' || obj.message === undefined) &&
            (typeof obj.err === 'object' || obj.err === undefined) &&
            (typeof obj.context === 'string' || obj.context === undefined)
        );
    }

}
