import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDTO {
        @Transform(({value}) => value.toLowerCase())
        @IsEmail()
        @IsNotEmpty()
        @ApiProperty()
        readonly email?: string;

        //  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })

        @IsString()
        @ApiProperty()
        // @Matches(/^\d{6}$/, {message: 'code must be exactly 6 digits'})
        readonly otp?: number;
}