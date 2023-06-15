import { ConflictException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { NameDto, NewPassDto, UsernameDto } from "src/auth/dto";
import { Response } from "express";
import * as path from "path"
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private env_file: ConfigService) {}

    async setTfaSecret(secret: string, user_id: number) {
        return await this.prisma.user.update({
            where: {
                id: user_id,
            },

            data: {
                TfaSecret: secret,
            },
        });
    }

    async turnOnTfa(user: User) {
        return await this.prisma.user.update({
            where: {
                id: user.id,                
            },

            data: {
                IsTfaEnabled: true,
            },
        });
    }

    async turnOffTfa(user: User) {
        await this.prisma.user.update({
            where: {
                id: user.id,                
            },

            data: {
                IsTfaEnabled: false,
            },
        });
    }

    async isTfaEnable(userId: number): Promise<boolean> {
        const user: User = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (user.IsTfaEnabled === true)
            return true;
        return false;
    }

    async onlineStats(user: User) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                Status: "online",
            },
        });
    }

    async ongameStats(user: User) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                Status: "playing",
            },
        });
    }

    async offlineStats(user: User) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                Status: "offline",
            },
        });
    }

    async isPassValid(newpassdto: NewPassDto, user: User) {
        const verify = await argon.verify(user.hash, newpassdto.password);
        if (verify)
            return true;
        return false;
    }

    async setNewPass(newpassdto: NewPassDto, user: User) {
        const hash = await argon.hash(newpassdto.new_password);
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                hash: hash,
            },
        });
    }

    async changeUsername(user: User, usernamedto: UsernameDto) {
        const exist = await this.prisma.user.findUnique({
            where: {
                username: usernamedto.username,
            },
        });
        if (exist)
            throw new ConflictException("username already taken")
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                username: usernamedto.username,
            },
        });
    }

    async changeName(user: User, name: NameDto) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                firstname: name.firstname,
                lastname: name.lastname,
            },
        });
    }

    async updateAvatar(avatar: Express.Multer.File, user: User) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });
        //delete the old avatar if there is a one other than the default
        if (find_user.avatar != "profile.png") {
            fs.unlinkSync(("src/avatars/uploads/" + find_user.avatar));
        }
        //give the new avatar a name (username + id + .ext)
        const file_ext = avatar.originalname.split('.')[1]; //the ext of the new avatar file
        const filename = `${find_user.username}${find_user.id}.${file_ext}`;
        //rename the new avatar file
        fs.renameSync(avatar.path, ("src/avatars/uploads/" + filename));
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                avatar: filename,
            },
        });
    }

    async getAvatar(user: User, res: Response) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });
        //if the user has the default avatar
        if (find_user.avatar === "profile.png") {
            const absolutePath = path.join(__dirname, this.env_file.get('DEFAULT_AVATAR_PATH'), user.avatar);
            return res.sendFile(absolutePath);
        }
        //if the user has a custom avatar
        else {
            const absolutePath = path.join(__dirname, this.env_file.get('AVATAR_PATH'), user.avatar);
            return res.sendFile(absolutePath);
        }   
    }
}