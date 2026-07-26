import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsString } from "class-validator";

export class ImageDTO {
    @IsString()
    @ApiProperty()
    secure_url?: string;

    @IsString()
    @ApiProperty()
    public_id?: string;
}

export class UpdateCoureDTO {
    @IsString()
    @ApiPropertyOptional()
    title?: string;

    @IsString()
    @ApiPropertyOptional()
    description?: string;

    @IsObject()
    @ApiPropertyOptional()
    image?: ImageDTO;
}