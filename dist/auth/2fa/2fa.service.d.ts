import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
export declare class TfaService {
    private prisma;
    private userService;
    private env_file;
    constructor(prisma: PrismaService, userService: UserService, env_file: ConfigService);
    generateTfaSecret(user: User): Promise<any>;
    generateQrCode(stream: Response, optUrl: string): Promise<any>;
    isTfaValid(TfaCode: string, user: User): any;
}
