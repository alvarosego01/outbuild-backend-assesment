


import { IsString, IsUrl, MinLength } from 'class-validator';

export class CreateScheduleDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsUrl()
    imageUrl: string;

}

