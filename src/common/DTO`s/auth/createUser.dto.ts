import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator"

export class CreateUserDTO {
    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    readonly name?: string;

    @Transform(({value}) => value.toLowerCase())
    @IsEmail()
    @IsNotEmpty()
    readonly email?: string;

    @IsString()
    @MinLength(8)
    readonly password?: string;

    @IsString()
    readonly role?: string;

    @IsString()
    readonly phone?: string;

    @IsNumber()
    @Min(12)
    @Max(65)
    readonly age?: number;

    @IsString()
    readonly country?: string;

    @IsString()
    readonly city?: string;
}