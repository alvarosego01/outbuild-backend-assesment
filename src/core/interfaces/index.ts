

export * from './api_response';


export interface User_Auth_I {
    sub: string;
    email: string;
    token?: string;
 }