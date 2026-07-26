import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateCourseDTO } from 'src/common/DTO`s/courses/createCourse.dto';
import { UpdateCoureDTO } from 'src/common/DTO`s/courses/updateCoures.dto';
import { Course } from 'src/DB/entities/course.entity';
import { User, UserRole } from 'src/DB/entities/user.entity';
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly cloudinary: CloudinaryService,
    ) {}

    async createCourse(user: Partial<User>, courseData: CreateCourseDTO) {
        const instructor = await this.userRepository.findOne({
            where: {
                id: user.id,
            },
            relations: {
                instructorCourses: true,
            }
        })
        if (instructor?.instructorCourses) {
            instructor?.instructorCourses?.map((course) => {
            if (course.title == courseData.title && instructor?.id == user.id)
                throw new BadRequestException('this course title already exist');
        })
        }

        const course = this.courseRepository.create({
            title: courseData.title,
            description: courseData.description,
            price: courseData.price,
            instructor: {
                id: user.id,
            },
            image: {
                secure_url: courseData.image?.secure_url || '',
                public_id: courseData.image?.public_id || '',
            }
        });
        await this.courseRepository.save(course);

        return {
            msg: 'course created successfully',
            data: course,
            status: 201,
        }
    }

    async updateCouse(body: UpdateCoureDTO ,user: User, id: number) {
        console.log(body);
        const course = await this.courseRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                instructor: true,
            }
        })
        if (!course) throw new BadRequestException('course not found');

        if (user.id != course.instructor?.id) 
            throw new BadRequestException('un-authorized access');

        console.log(body.image)
        const updatedCourse = await this.courseRepository.update(
            {id: id as number},
            {
                title: body.title || course.title,
                description: body.description || course.description,
                image: {
                    secure_url: body.image?.secure_url || course.image?.secure_url,
                    public_id: body.image?.public_id || course.image?.public_id,
                }
            },
        )
        return {
            msg: 'course updated successfully',
            data: updatedCourse,
            status: 202,
        }
    }

    async deleteCourse(user: Partial<User>, id: number) {
        const course = await this.courseRepository.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                instructor: true,
            }
        })
        if (!course) throw new BadRequestException('course not found');
        
        if (user.role == UserRole.INSTRUCTOR) {
            if (course.instructor?.id !== user.id) 
                throw new BadRequestException('un-authorized access');
            }
        await this.cloudinary.deleteImage(course.image?.public_id as string)
        await this.courseRepository.delete(id);

        return {
            msg: 'course deleted successfully',
        }
    }

    // for all users
    async getAllCourses(page: number, title: string, minPrice: number, maxPrice: number){
        if (!page) page = 1;
        const where: any = {};
        if (title) {
            where.title = ILike(`%${title}%`)
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = Between(minPrice, maxPrice)
        } else if (minPrice !== undefined) {
            where.price = MoreThanOrEqual(minPrice)
        } else if (maxPrice !== undefined) {
            where.price = LessThanOrEqual(maxPrice)
        }

        const allCourses = await this.courseRepository.find({
            skip: (page - 1) * 5,
            take: 5,
            where,
        });

        return {
            data: allCourses,
        }
    }

    // for instructors 
    async getMyCourses(user: Partial<User>) {
        console.log(user);
        const instructor = await this.userRepository.findOne({
            where: {
                id: user.id,
            },
            relations: {
                instructorCourses: true,
            }
        })

        return {
            data: instructor?.instructorCourses,
            msg: 'test'
        }
    }

    // for all users
    async getCourseById(id: number){
        const course = await this.courseRepository.findOne({
            where: {
                id: id,
            }
        });

        return {
            data: course,
        }
    }

}
