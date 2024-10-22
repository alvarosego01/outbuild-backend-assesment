
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterUser_Dto {

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    last_name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;

}
