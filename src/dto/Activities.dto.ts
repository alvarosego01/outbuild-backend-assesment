
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsString, MinLength } from "class-validator";

export class CreateActivity_Dto {

    @IsString()
    @MinLength(3)
    name: string;

    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

}

export class UpdateActivity_Dto {

    @IsString()
    name: string;

    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

}

export class BulkCreateActivityDto {

    @IsArray()
    @ArrayNotEmpty()
    activities: CreateActivity_Dto[];

}

/*
{
    "activities": [
        {
            "name": "Activity 1",
            "startDate": "2021-08-01T00:00:00.000Z",
            "endDate": "2021-08-01T00:00:00.000Z"
        },
        {
            "name": "Activity 2",
            "startDate": "2021-08-01T00:00:00.000Z",
            "endDate": "2021-08-01T00:00:00.000Z"
        },
        {
            "name": "Activity 3",
            "startDate": "2021-08-01T00:00:00.000Z",
            "endDate": "2021-08-01T00:00:00.000Z"
        }
    ]
}

{
    "name": "Activity 1 - single",
    "startDate": "2021-08-01T00:00:00.000Z",
    "endDate": "2021-08-01T00:00:00.000Z"
}

*/
