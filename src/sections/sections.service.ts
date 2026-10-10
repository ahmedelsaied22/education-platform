import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSectionDTO } from 'src/common/DTO`s/sections/createSection.dto';
import { UpdateSectionDTO } from 'src/common/DTO`s/sections/updateSection.dto';
import { Section } from 'src/DB/entities/section.entity';
import { User } from 'src/DB/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectionsService {
    constructor(
        @InjectRepository(Section)
         private readonly sectionRepository: Repository<Section>,
         @InjectRepository(User)
         private readonly userRepository: Repository<User>,
    ) {}

    async createSection(
        body: CreateSectionDTO, 
        user: Partial<User>, 
        courseId: number
    ) {
        try {
        const instructor = await this.userRepository.createQueryBuilder('user')
            .innerJoin('user.instructorCourses', 'course')
            .innerJoin('course.instructor', 'instructor')
            .where('instructor.id = :instructorId', { instructorId: user.id })
            .getOne();

            if (instructor?.id !== user.id) {
                throw new ForbiddenException('You are not the instructor of this course')
            }
        const sectionExist = await this.sectionRepository.findOne({
            where: {
                title: body.title,
                courseId: courseId,
            }
        });
        if (sectionExist) {
            throw new BadRequestException('Section with this title already exists');
        }
        const section = this.sectionRepository.create({
            title: body.title,
            description: body.description,
            order: body.order,
            courseId: courseId,
        });
        await this.sectionRepository.save(section);
        return {
            msg: 'Section created successfully',
            data: section,
            status: 201,
        };
        } catch (error) {
            throw new BadRequestException(error || 'Something went wrong');
        }
    }

    async updateSection(
        body: UpdateSectionDTO, 
        user: Partial<User>, 
        courseId: number, 
        sectionId: number
    ) {
        if (!courseId || !sectionId) {
            throw new BadRequestException('Course ID and Section ID are required');
        }
        const section = await this.sectionRepository.findOne({
            where: {
                id: sectionId,
                courseId: courseId,
            }});
            if (!section) {
                throw new BadRequestException('Section not found');
            }

        const instructor = await this.userRepository.createQueryBuilder('user')
            .innerJoin('user.instructorCourses', 'course')
            .innerJoin('course.instructor', 'instructor')
            .where('instructor.id = :instructorId', { instructorId: user.id })
            .getOne();

            if (instructor?.id !== user.id) {
                throw new ForbiddenException('You are not the instructor of this course')
            }

            await this.sectionRepository.update(sectionId, {
                title: body.title || section.title,
                description: body.description || section.description,
                order: body.order || section.order,
            })

            return {
                msg: 'section updated successfully',
                status: 202
            }
    }

    async deleteSection(
        user: Partial<User>, 
        courseId: number,
        sectionId: number
    ) {
        if (!courseId || !sectionId) {
            throw new BadRequestException('Course ID and Section ID are required');
        }
        const section = await this.sectionRepository.findOne({
            where: {
                id: sectionId,
                courseId: courseId,
            }});
            if (!section) {
                throw new BadRequestException('Section not found');
            }
            const instructor = await this.userRepository.createQueryBuilder('user')
            .innerJoin('user.instructorCourses', 'course')
            .innerJoin('course.instructor', 'instructor')
            .where('instructor.id = :instructorId', { instructorId: user.id })
            .getOne();

            console.log(instructor?.id, user.id);

            if (instructor?.id !== user.id) {
                throw new ForbiddenException('You are not the instructor of this course')
            }

            await this.sectionRepository.remove(section);
            return {
                msg: 'Section deleted successfully',
                status: 200
            };
    }

    async getSection(
        courseId: number,
    ) {
        if (!courseId) {
            throw new BadRequestException('Course ID is required');
        }
        const allSections = await this.sectionRepository.find({
            where: {
                courseId: courseId
            },
            order: {
                order: 'ASC',
                courseId: 'ASC',
            }
        })
        return {
            data: allSections,
            status: 200
        };
    }

    async getSectionById(
        courseId: number,
        sectionOrder: number,
    ) {
        if (!courseId || !sectionOrder) {
            throw new BadRequestException('Course ID and Section Order are required');
        }
        const section = await this.sectionRepository.findOne({
            where: {
                order: sectionOrder,
                courseId: courseId,
            }
        });
        if (!section) {
            throw new BadRequestException('Section not found');
        }
        return {
            data: section,
            status: 200
        };
    }
}
