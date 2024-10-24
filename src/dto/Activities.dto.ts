
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsString, MinLength, ValidateNested } from "class-validator";


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

export class BulkCreateActivityDto {


        @ValidateNested({ each: true })
    @Type(() => CreateActivity_Dto)
    activities: CreateActivity_Dto[];

}

