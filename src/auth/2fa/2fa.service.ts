import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as speakeasy from "speakeasy"
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import * as qrcode from "qrcode"
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TfaService {
    constructor(private prisma: PrismaService, private userService: UserService, private env_file: ConfigService) {}

    //generate the secret and otpauthUrl
    async generateTfaSecret(user: User) {
        const secret = speakeasy.generateSecret();
        const otpUrl = speakeasy.otpauthURL({
            secret: secret.ascii,
            label: user.email,
            issuer: this.env_file.get('APP_NAME'),
        });
        await this.userService.setTfaSecret(secret.base32, user.id);
        return otpUrl;
    }

    //generate Qrcode
    async generateQrCode(stream: Response, optUrl: string) {
        return qrcode.toFileStream(stream, optUrl);
    }

    //check validation
    isTfaValid(TfaCode: string, user: User) {
        const base32secret = user.TfaSecret;
        const verify = speakeasy.totp.verify({
            secret: base32secret,
            encoding: this.env_file.get('ENCODING'),
            token: TfaCode,
        });
        return (verify);
    }

}