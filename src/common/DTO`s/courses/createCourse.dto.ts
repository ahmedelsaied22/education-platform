import { Transform } from "class-transformer";
import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { ImageDTO } from "./updateCoures.dto";

export class CreateCourseDTO {

    @Transform(({value}) => value.trim().toLowerCase())
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsString()
    description?: string;

    @IsObject()
    image?: ImageDTO;
}