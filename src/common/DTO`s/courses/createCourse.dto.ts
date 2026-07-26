import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { ImageDTO } from "./updateCoures.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCourseDTO {

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
    price?: number;

    @IsObject()
    @ApiPropertyOptional()
    image?: ImageDTO;
}