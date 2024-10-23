
import { Request, Response, NextFunction } from 'express';
import { _Response_I } from '../interfaces';

export const paginator = (req: Request, res: Response, next: NextFunction) => {

    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if(page < 0){
        page = 1;
    }

    if(limit < 0){
        limit = 10;
    }

    (req as any).paginator = {
        page: Number(page),
        limit: Number(limit)
    };

    next();

};