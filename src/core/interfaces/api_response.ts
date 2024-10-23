

export interface PaginationMeta_I {
    page: number,
    limit: number,
    total: number,
    next: boolean,
    prev: boolean,
}

export interface _Response_I<T = any> {
    ok: boolean;
    statusCode: number;
    path?: string;
    data?: T;
    message?: any;
    err?: any;
    context?: string;
    // paginator?: PaginationMeta_I;
}
