import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from 'src/DB/entities/section.entity';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JWTService } from 'src/utils/security/token';
import { User } from 'src/DB/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, User])],
  controllers: [SectionsController],
  providers: [SectionsService, JWTService, JwtService]
})
export class SectionsModule {}
