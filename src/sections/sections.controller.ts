import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDTO } from 'src/common/DTO`s/sections/createSection.dto';
import { AuthGaurd, type AuthReq } from 'src/common/Gaurds/auth.guard';
import { Roles, RolesGuard } from 'src/common/Gaurds/role.guard';
import { User, UserRole } from 'src/DB/entities/user.entity';
import { UpdateSectionDTO } from 'src/common/DTO`s/sections/updateSection.dto';

@Controller('courses/:CourseId/sections')
export class SectionsController {
    constructor(
        private readonly sectionsService: SectionsService,
    ) {}

    @Post('create-section')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    async createSection (
        @Body() body: CreateSectionDTO, 
        @Req() req: any, 
        @Param('CourseId') courseId: number) {
        const user = req.user;
        return await this.sectionsService.createSection(body, user, courseId);
    }

    @Patch('update-section/:sectionId')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    async updateSection(
        @Body() body: UpdateSectionDTO, 
        @Req() req: AuthReq, 
        @Param('CourseId') courseId: number,
        @Param('sectionId') sectionId: number,
    ) {
        const user = req.user;
        return await this.sectionsService.updateSection(body,user, courseId, sectionId);
    }

    @Delete('delete-section/:sectionId')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    async deleteSection(
        @Req() req: AuthReq,
        @Param('CourseId') courseId: number,
        @Param('sectionId') sectionId: number,
    ) {
        const user = req.user;
        return await this.sectionsService.deleteSection(user, courseId, sectionId);
    }

    @Get('/')
    async getSection(
        @Param('CourseId') courseId: number,
    ) {
        return await this.sectionsService.getSection(courseId);
    }

    @Get('/:sectionOrder')
    async getSectionById(
        @Param('CourseId') courseId: number,
        @Param('sectionOrder') sectionOrder: number,
    ) {
        return await this.sectionsService.getSectionById(courseId, sectionOrder);
    }
}
