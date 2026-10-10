import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSectionDTO {

    @Transform(({value}) => value.trim().toLowerCase())
    @IsString()
    @ApiProperty()
    title?: string;

    @IsString()
    @ApiProperty()
    description?: string;

    @IsNumber()
    @ApiProperty()
    order?: number;
}