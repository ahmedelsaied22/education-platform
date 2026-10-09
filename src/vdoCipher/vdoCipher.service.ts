import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import {
  createVideoDto,
  videoStatus,
} from 'src/common/DTO`s/vdoCipher/createvideo.dto';
import { Course } from 'src/DB/entities/course.entity';
import { Video } from 'src/DB/entities/video.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class VdoCipherService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async getUploadRequest(body: createVideoDto) {
    try {
      const response = await axios.put(
        `${process.env.VDOCIPHER_API_URL as string}?title=${body.title as string}`,
        {},
        {
          headers: {
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        },
      );
      console.log(response);
      console.log(response.data);
      const videoData = {
        title: body.title,
        videoId: response.data.videoId,
        description: body.description || ' ',
        duration: response.data.duration || '0',
        status: response.data.status || 'PROCESSING',
      };
      // console.log({videoData});
      if (!videoData.videoId) {
        throw new Error(
          'Video ID is missing in the response from VdoCipher API',
        );
      }

      const video = this.videoRepository.create(videoData);
      await this.videoRepository.save(video);

      // console.log(response);
      return {
        msg: 'Upload request generated successfully',
        data: {
          uploadData: response.data,
          video: video,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to generate upload request',
        error as object,
      );
    }
  }

  async getVideoStatus(videoId: string) {
    const response = await axios.get(
      `https://dev.vdocipher.com/api/videos/${videoId}`,
      {
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          Accept: 'application/json',
        },
      },
    );
    return response.status === 200 ? response.data : null;
  }

  async updateVideoStatus(videoId: string) {
    const video = await this.videoRepository.findOne({ where: { videoId } });
    if (!video) {
      throw new BadRequestException(`Video with ID ${videoId} not found`);
    }
    video.status = videoStatus.READY;
    await this.videoRepository.save(video);
    return { message: 'status updated on database' };
  }

//   we need to make the lesson, section module first
  async generateOtp(user: any, videoId: string) {
    try {
      const video = await this.videoRepository.findOne({ where: { videoId } });
      if (!video) {
        throw new BadRequestException(`Video with ID ${videoId} not found`);
      }
    //   const instructorOfThisCourse = await this.videoRepository
    //     .createQueryBuilder('video')
    //     .leftJoin('video.lesson', 'lesson')
    //     .leftJoin('lesson.section', 'section')
    //     .leftJoin('section.course', 'course')
    //     .where('video.videoId = :videoId', { videoId })
    //     .andWhere('course.instructorId = :instructorId', {
    //       instructorId: user.id,
    //     })
    //     .getOne();
      console.log(user.id);
      console.log(video);
    //   console.log(instructorOfThisCourse);
      if (
        user.role === 'instructor' &&
        video.lesson?.section?.course?.instructor?.id !== user.id
      ) {
        throw new ForbiddenException(
          'You are not the instructor of this course',
        );
      }
      if (user.role !== 'admin') {
        const userInrolledInThisCourse = await this.videoRepository
          .createQueryBuilder('video')
          .leftJoin('video.lesson', 'lesson')
          .leftJoin('lesson.section', 'section')
          .leftJoin('section.course', 'course')
          .leftJoin('course.students', 'user')
          .where('video.videoId = :videoId', { videoId })
          .andWhere('user.id = :userId', { userId: user.id })
          .getOne();
        if (!userInrolledInThisCourse) {
          throw new ForbiddenException('You are not enrolled in this course');
        }
      }

      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        {
          ttl: 500,
        },
        {
          headers: {
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        },
      );
      return response;
    } catch (error) {
      throw new BadRequestException(
        'Failed to generate OTP',
        error as unknown as Object,
      );
    }
  }
}
