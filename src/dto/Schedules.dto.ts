


import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateSchedule_Dto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsUrl()
    imageUrl: string;

}


export class UpdateSchedule_Dto {

    @IsOptional()
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsUrl()
    imageUrl: string;

}