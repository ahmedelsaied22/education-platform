import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResendVerification {
        @Transform(({value}) => value.toLowerCase())
        @IsEmail()
        @IsNotEmpty()
        @ApiProperty()
        readonly email?: string;

}