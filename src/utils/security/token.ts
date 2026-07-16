import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class JWTService {
    constructor(private readonly jwt: JwtService) {}

    async sign({ payload, options = {}}: {payload: any, options: JwtSignOptions}){
        const token = await this.jwt.sign(payload, options);
        return token;
    }

    async verify({ token, options = {}}: {token: string, options: JwtVerifyOptions}) {
        const data = await this.jwt.verify(token, options);
        return data;
    }
}