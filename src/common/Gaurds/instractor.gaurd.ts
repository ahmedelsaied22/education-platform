import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { UserRole } from 'src/DB/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if ( user.role != UserRole.INSTRUCTOR ) 
        throw new BadRequestException('un-authorized access');
    
    return true;
  }
}