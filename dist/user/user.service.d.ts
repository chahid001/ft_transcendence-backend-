/// <reference types="multer" />
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { NameDto, NewPassDto, UsernameDto } from "src/auth/dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
export declare class UserService {
    private prisma;
    private env_file;
    constructor(prisma: PrismaService, env_file: ConfigService);
    setTfaSecret(secret: string, user_id: number): Promise<User>;
    turnOnTfa(user: User): Promise<User>;
    turnOffTfa(user: User): Promise<void>;
    isTfaEnable(userId: number): Promise<boolean>;
    onlineStats(user: User): Promise<void>;
    ongameStats(user: User): Promise<void>;
    offlineStats(user: User): Promise<void>;
    isPassValid(newpassdto: NewPassDto, user: User): Promise<boolean>;
    setNewPass(newpassdto: NewPassDto, user: User): Promise<void>;
    changeUsername(user: User, usernamedto: UsernameDto): Promise<void>;
    changeName(user: User, name: NameDto): Promise<void>;
    updateAvatar(avatar: Express.Multer.File, user: User): Promise<void>;
    getAvatar(user: User, res: Response): Promise<void>;
}
