import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { VdoCipherService } from './vdoCipher.service';
import { Roles, RolesGuard } from 'src/common/Gaurds/role.guard';
import { AuthGaurd } from 'src/common/Gaurds/auth.guard';
import { UserRole } from 'src/DB/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { createVideoDto } from 'src/common/DTO`s/vdoCipher/createvideo.dto';

@Controller('vdocipher')
export class VdoCipherController {
    constructor(private readonly vdoService: VdoCipherService) {}

    @Post('upload-url')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    async getUploadUrl(@Body() body: createVideoDto) {
        return await this.vdoService.getUploadRequest(body);
    }

    @Get('status/:id')
    async getVideoStatus(@Param('id') id: string) {
        return await this.vdoService.getVideoStatus(id);
    }

    @Post('handle-webhook')
    // @UseGuards(AuthGaurd, RolesGuard)
    // @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    // @UseInterceptors(FileInterceptor('video'))
    async handleWebhook(@Body() body: any) {
        // console.log('Received webhook:', body);
        const videoId = body?.payload?.id as string;

        if (!videoId) 
            throw new BadRequestException('Video ID is missing');
        const status = body?.payload?.status;
        if (status !== "ready") {
            throw new BadRequestException(`Video status is not READY. Current status: ${status}`);
            // Update the video status in the database to "READY"
        }
        await this.vdoService.updateVideoStatus(videoId);
    }

    @Post('generate-otp/:id')
    @UseGuards(AuthGaurd)
    async otp(@Req() req: any, @Param('id') id: string) {
        const user = req.user;
        return this.vdoService.generateOtp( user, id);
    }
}
