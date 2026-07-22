import { IsObject, IsString } from "class-validator";

export class ImageDTO {
    @IsString()
    secure_url?: string;

    @IsString()
    public_id?: string;
}

export class UpdateCoureDTO {
    @IsString()
    title?: string;

    @IsString()
    description?: string;

    @IsObject()
    image?: ImageDTO;
}