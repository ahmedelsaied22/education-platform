import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSectionDTO {

    @Transform(({value}) => value.trim().toLowerCase())
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title?: string;

    @IsString()
    @ApiProperty()
    description?: string;

    @IsNumber()
    @ApiProperty()
    order?: number;
}