import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGaurd, type AuthReq } from 'src/common/Gaurds/auth.guard';
import { Roles, RolesGuard } from 'src/common/Gaurds/role.guard';
import { UserRole } from 'src/DB/entities/user.entity';
import { Multer } from 'multer';
import { CreateCourseDTO } from 'src/common/DTO`s/courses/createCourse.dto';
// import { UpdateCoureDTO } from 'src/common/DTO`s/courses/updateCoures.dto';
import { uploadFromBuffer, UploadImage } from 'src/utils/multer/multer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly cloudinary: CloudinaryService,
    ) {}

    @Post('create-course')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    async createCourse(
        @Req() req: AuthReq, 
        @Body() body: Partial<CreateCourseDTO>,
        @UploadedFile() image: Express.Multer.File) {
        const user = req.user;
        if (image) {
            const imageData = await this.cloudinary.uploadSingleImage(image)
            body.image = imageData
        }
        return await this.courseService.createCourse(user, body);
    }

    @Patch('update-course/:id')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    async updateCouse(
        @Req() req: AuthReq,
        @Body() body: any, 
        @UploadedFile() image: Express.Multer.File, 
        @Param('id') id: number
    ) {

const imageData = await this.cloudinary.uploadSingleImage(image)

        body.image = imageData;
        const user = req.user;
        
        return await this.courseService.updateCouse(body, user, id);
    }

    @Delete('delete-course/:id')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    async deleteCourse(@Param('id') id: number, @Req() req: AuthReq) {
        const user = req.user;
        return await this.courseService.deleteCourse(user,id);
    }

    @Get('')
    async getAllCourses() {
        return await this.courseService.getAllCourses()
    }

    @Get('/my-courses')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.INSTRUCTOR)
    async getMyCourses(@Req() req: AuthReq) {
        const user = req.user;
        // console.log(user)
        return await this.courseService.getMyCourses(user)
    }

    @Get('/:id')
    async getCourseById(@Param('id') id: number) {
        return await this.courseService.getCourseById(id)
    }

}
