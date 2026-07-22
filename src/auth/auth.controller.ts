import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/common/DTO`s/auth/createUser.dto';
import { User } from 'src/DB/entities/user.entity';
import { VerifyEmailDTO } from 'src/common/DTO`s/auth/verifyEmail.dto';
import { LoginDTO } from 'src/common/DTO`s/auth/login.dto';
import { AuthGaurd, type AuthReq } from 'src/common/Gaurds/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register (@Body() UserData: CreateUserDTO) {
        return await this.authService.register(UserData as Partial<User>);
    }

    @Post('verify-email')
    async verifyEmail(@Body() body: VerifyEmailDTO) {
        return await this.authService.verifyEmail(body);
    }

    @Post('resend-verification')
    async resendVerification(@Body() body: {email: string}) {
        return await this.authService.resendVerification(body);
    }

    @Post('login')
    async login(@Body() body: LoginDTO) {
        return await this.authService.login(body);
    }

    @Post('refresh-token')
    async refreshToken(@Req() req: AuthReq) {
        const refreshToken = req.headers['authorization']
        if (!refreshToken.startsWith(process.env.BEARER as string)) 
            throw new BadRequestException('in-valid token')

        const token = refreshToken.split(' ')[1]
        return await this.authService.refreshToken(token);
    }

    @Post('logout')
    @UseGuards(AuthGaurd)
    async logout(@Req() req: AuthReq) {
        const user = req.user;
        return await this.authService.logout(user);
    }

    @Post('me')
    @UseGuards(AuthGaurd)
    async me(@Req() req: AuthReq) {
        const user = req.user;
        return {
            data: user,
        }
    }
}
