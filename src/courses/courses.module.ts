import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/DB/entities/course.entity';
import { JWTService } from 'src/utils/security/token';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/DB/entities/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryController } from 'src/cloudinary/cloudinary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User]), CloudinaryModule],
  controllers: [CoursesController, CloudinaryController],
  providers: [CoursesService, Course, JWTService, JwtService, CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider]
})
export class CoursesModule {}
