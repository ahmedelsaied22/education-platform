import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator"

export class CreateUserDTO {
    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name?: string;

    @Transform(({value}) => value.toLowerCase())
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    readonly email?: string;

    @IsString()
    @MinLength(8)
    @ApiProperty()
    readonly password?: string;

    @IsString()
    readonly role?: string;

    @IsString()
    @ApiProperty()
    readonly phone?: string;

    @IsNumber()
    @Min(10)
    @Max(80)
    @ApiPropertyOptional()
    readonly age?: number;

    @IsString()
    @ApiProperty()
    readonly country?: string;

    @IsString()
    @ApiPropertyOptional()
    readonly city?: string;
}