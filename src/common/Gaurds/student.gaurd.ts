import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/DB/entities/user.entity';
import { JWTService } from 'src/utils/security/token';
import { Repository } from 'typeorm';

export interface AuthReq extends Request {
  user: Partial<User>;
  token: string;
}

@Injectable()
export class StudentGaurd implements CanActivate {
    constructor(private readonly JWT: JWTService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];

    if (!auth?.startsWith(process.env.BEARER as string))
         throw new BadRequestException('in-valid token')
    const token = auth.split(' ')[1];

    const payload: {
        id: string,
        email: string,
    } = await this.JWT.verify({ token, options: {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY as string,
    }})

    const user = await this.userRepository.findOne({
        where: {
            email: payload.email,
        }
    })
    if (!user) throw new BadRequestException('user is deleted');
    if (!user.emailVerified) throw new BadRequestException('email not confirmed');

    request.token = token;
    request.user = user;

    return true;
  }
}
