import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/DB/entities/user.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { JWTService } from 'src/utils/security/token';
import { generateOTP } from 'src/utils/email/createOTP';
import { SendEmail } from 'src/utils/email/send-email';
import { Compare, Hash } from 'src/utils/security/hash';
import { VerifyEmailDTO } from 'src/common/DTO`s/auth/verifyEmail.dto';
import { LoginDTO } from 'src/common/DTO`s/auth/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly JwtService: JWTService,
  ) {}

  async register(userData: Partial<User>) {
    const userExist = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });
    if (userExist)
      throw new BadRequestException(
        'email already exist, try to login instead',
      );

    const user = this.userRepository.create(userData);

    const otp = generateOTP();
    const hashedOTP = await Hash(otp);
    const hashedPass = await Hash(String(userData.password))

    await SendEmail({
      to: user.email as  string,
      subject: 'Verify your account',
      html: String(otp),
    });

    user.password = hashedPass;
    user.otp = hashedOTP;
    user.otpExpiredAt = new Date(Date.now() + 1000 * 60)
    await this.userRepository.save(user);

    return {
      msg: 'user created successfully',
      status: 201,
    };
  }

  async verifyEmail({ email, otp }: VerifyEmailDTO) {
    const userExist = await this.userRepository.findOne({
      where: {
        email: email,
      }
    })
    if (!userExist) throw new BadRequestException('user not found');
    if (userExist.emailVerified) throw new BadRequestException('email already verified');

    if (userExist.otpExpiredAt as Date <= new Date(Date.now()) ) 
      throw new BadRequestException('in-valid credintials');

    const hashedOtp = userExist.otp;
    const otpRight = await Compare(otp?.toString() as string, hashedOtp as string)

    if (!otpRight) throw new BadRequestException('in-valid credintials');
    userExist.emailVerified = true;
    await this.userRepository.save(userExist);

    return {
      msg: 'email verified successfully',
      status: 202,
    }
  }

  async resendVerification(body: {email: string}) {
    const isEmailExist = await this.userRepository.findOne({
      where: {
        email: body.email,
      }
    })
    if(!isEmailExist) throw new BadRequestException('user is deleted');
    if(isEmailExist.emailVerified) throw new BadRequestException('email already verified');

    const otp = generateOTP()
    await SendEmail({ 
      to: isEmailExist.email as string,
      subject: "resend otp",
      html: `<h1> ${otp} </h1>`
    })

    await this.userRepository.update(
      {email: body.email},
      {otp: await Hash(otp.toString() as string),
       otpExpiredAt: new Date(Date.now() + 1000 * 60),
      },
    )
    return {
      msg: 'check your inbox',
    }
  }

  async login({email, password}: LoginDTO) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      }
    })
    if (!user) throw new BadRequestException('in-valid credintials');
      const passwordCheck = await Compare(password as string, user.password as string)
    if (!passwordCheck) throw new BadRequestException('in-valid credintials');
    if (!user.emailVerified) throw new BadRequestException('email not verified')

    const access_token = await this.JwtService.sign({
      payload: {
        id: user.id,
        email,
      },
      options: {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY as string,
        expiresIn: '1 H',
      }
    });
    const refresh_token = await this.JwtService.sign({
      payload: {
        id: user.id,
        email,
      },
      options: {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY as string,
        expiresIn: '7 D',
      }
    });

    await this.userRepository.update(
      {email: user.email},
      {refreshToken: await Hash(refresh_token),
       refreshTokenExpiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    )

    return {
      data: {
        access_token,
        refresh_token,
      },
      status: 200,
      msg: 'loged in successfully',
    }
  }

  async refreshToken(token: string) {
    const payload: {
      id: string,
      email: string,
    } = await this.JwtService.verify({ token: token, options: {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY as string,
    }})
    const user = await this.userRepository.findOne({
      where: {
        email: payload.email,
      }
    })
    if (!user) throw new BadRequestException('user is deleted')
    if (new Date(user.refreshTokenExpiredAt as Date) <= new Date(Date.now())) {
      throw new BadRequestException('expired token, login again please');
    }
    const refreshTokenCheck = await Compare(token, user.refreshToken as string)
    if (!refreshTokenCheck) throw new BadRequestException('in-valid token')
    
    const access_token = await this.JwtService.sign({ payload: {
      id: user.id,
      email: user.email,
    }, options: {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY as string,
      expiresIn: '1 H',
    }})

    return {
      data: {
        access_token,
      }
    }
  }

  async logout(user: Partial<User>) {
    if (!user.refreshToken) 
      throw new BadRequestException('user already logged out')
    
    await this.userRepository.update(
      {email: user.email},
      {refreshToken: '',
       refreshTokenExpiredAt: new Date(Date.now()),
      }
    )
    return {
      msg: 'loged out successfully'
    }
  }
}
