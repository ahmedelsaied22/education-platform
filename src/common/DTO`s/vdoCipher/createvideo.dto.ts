import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export enum videoStatus {
    PROCESSING = 'PROCESSING',
    UPLOADED = 'UPLOADED',
    READY = 'READY',
    FAILED = 'FAILED',
}

export class createVideoDto {
        @IsString()
        @IsNotEmpty()
        @ApiProperty()
        readonly title?: string;

        // @IsString()
        // @IsNotEmpty()
        // @ApiProperty()
        // readonly videoId?: string;

        @IsString()
        @ApiProperty()
        readonly description?: string;

        // @IsString()
        // @ApiProperty()
        // readonly duration?: string;

        // @IsString()
        // @IsNotEmpty()
        // @ApiProperty({ enum: videoStatus , default: videoStatus.PROCESSING })
        // readonly status?: string;
}