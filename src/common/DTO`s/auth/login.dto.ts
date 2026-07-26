import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDTO {
        @Transform(({value}) => value.toLowerCase())
        @IsEmail()
        @IsNotEmpty()
        @ApiProperty()
        readonly email?: string;

        @IsString()
        @MinLength(8)
        @ApiProperty()
        readonly password?: string;
}