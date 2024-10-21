import { IsString, IsEmail, Matches } from "class-validator";

export class LoginUser_Dto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;

}