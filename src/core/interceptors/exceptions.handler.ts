import { Response } from 'express';
import { _Response_I } from '../interfaces';

export class ExceptionsHandler {

    constructor() { }

    EmitException(error: any, context?: string, message?: string) {

        let response: _Response_I = {} as _Response_I;

        if (this.isResponseStructure(error)) {
            response = {
                ...error,
                err: null,
                statusCode: error.statusCode || 500,
                message: message || error.message,
                context: context || 'ExceptionsHandler'
            }

        } else {
            response = {
                ok: false,
                statusCode: error.statusCode || 400,
                message: error.message || message || 'An unexpected error occurred',
                err: error,
                data: null,
                context: context || 'ExceptionsHandler'
            };
        }
            return response
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
