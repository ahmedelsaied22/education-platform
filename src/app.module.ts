import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VideoModule } from './vdoCipher/vdoCipher.module';
import { LessonsModule } from './lessons/lessons.module';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(
  {
 "type": "postgres",
 "host": process.env.DB_HOST,
 "port": parseInt(process.env.DB_PORT as string),
 "username": process.env.DB_USERNAME,
 "password": process.env.DB_PASSWORD,
 "database": process.env.DB_NAME,
 "autoLoadEntities": true,
 "entities": ["dist/**/*.entity{.ts,.js}"],
 "synchronize": true  // set to false in production
}),
    AuthModule,
    CoursesModule,
    CloudinaryModule,
    VideoModule,
    LessonsModule,
    SectionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
