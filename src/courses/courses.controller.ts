import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Multer } from 'multer';
import { AuthGaurd, type AuthReq } from 'src/common/Gaurds/auth.guard';
import { Roles, RolesGuard } from 'src/common/Gaurds/role.guard';
import { UserRole } from 'src/DB/entities/user.entity';
import { CreateCourseDTO } from 'src/common/DTO`s/courses/createCourse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBody, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { UpdateCoureDTO } from 'src/common/DTO`s/courses/updateCoures.dto';

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
    @ApiBody({ type: CreateCourseDTO, description: 'create new course' })
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
    @ApiBody({ type: UpdateCoureDTO, description: 'update on exists course' })
    @ApiSecurity('bearer')
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
    @ApiSecurity('bearer')
    async deleteCourse(@Param('id') id: number, @Req() req: AuthReq) {
        const user = req.user;
        return await this.courseService.deleteCourse(user,id);
    }

    @Get('')
    @ApiQuery({
        name: 'page',
        description: 'page number for get 5 courses',
        required: false,
    })
    @ApiQuery({
        name: 'title',
        description: 'title for getting specific courses',
        required: false,
    })
    @ApiQuery({
        name: 'minPrice',
        description: 'minimum price for courses',
        required: false,
    })
    @ApiQuery({
        name: 'maxPrice',
        description: 'maximum price for courses',
        required: false,
    })
    async getAllCourses(
        @Query('page') page: number,
        @Query('title') title: string,
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
    ) {
        return await this.courseService.getAllCourses(page, title, minPrice, maxPrice)
    }

    @Get('/my-courses')
    @UseGuards(AuthGaurd, RolesGuard)
    @Roles(UserRole.INSTRUCTOR)
    @ApiSecurity('bearer')
    async getMyCourses(@Req() req: AuthReq) {
        const user = req.user;
        return await this.courseService.getMyCourses(user)
    }

    @Get('/:id')
    async getCourseById(@Param('id') id: number) {
        return await this.courseService.getCourseById(id)
    }

}
