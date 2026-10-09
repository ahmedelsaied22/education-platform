import { Module } from '@nestjs/common';
import { VdoCipherService } from './vdoCipher.service';
import { VdoCipherController } from './vdoCipher.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JWTService } from 'src/utils/security/token';
import { CloudinaryController } from 'src/cloudinary/cloudinary.controller';
import { User } from 'src/DB/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Video } from 'src/DB/entities/video.entity';
import { Course } from 'src/DB/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Video, Course]) ,CloudinaryModule],
  controllers: [VdoCipherController, CloudinaryController],
  providers: [VdoCipherService, JWTService, JwtService, CloudinaryService, CloudinaryProvider, Video, Course],
})
export class VideoModule {}
