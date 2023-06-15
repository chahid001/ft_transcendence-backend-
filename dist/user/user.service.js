"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const path = require("path");
const config_1 = require("@nestjs/config");
const fs = require("fs");
let UserService = class UserService {
    constructor(prisma, env_file) {
        this.prisma = prisma;
        this.env_file = env_file;
    }
    async setTfaSecret(secret, user_id) {
        return await this.prisma.user.update({
            where: {
                id: user_id,
            },
            data: {
                TfaSecret: secret,
            },
        });
    }
    async turnOnTfa(user) {
        return await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                IsTfaEnabled: true,
            },
        });
    }
    async turnOffTfa(user) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                IsTfaEnabled: false,
            },
        });
    }
    async isTfaEnable(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (user.IsTfaEnabled === true)
            return true;
        return false;
    }
    async onlineStats(user) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                Status: "online",
            },
        });
    }
    async ongameStats(user) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                Status: "playing",
            },
        });
    }
    async offlineStats(user) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                Status: "offline",
            },
        });
    }
    async isPassValid(newpassdto, user) {
        const verify = await argon.verify(user.hash, newpassdto.password);
        if (verify)
            return true;
        return false;
    }
    async setNewPass(newpassdto, user) {
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
    async changeUsername(user, usernamedto) {
        const exist = await this.prisma.user.findUnique({
            where: {
                username: usernamedto.username,
            },
        });
        if (exist)
            throw new common_1.ConflictException("username already taken");
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                username: usernamedto.username,
            },
        });
    }
    async changeName(user, name) {
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
    async updateAvatar(avatar, user) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });
        if (find_user.avatar != "profile.png") {
            fs.unlinkSync(("src/avatars/uploads/" + find_user.avatar));
        }
        const file_ext = avatar.originalname.split('.')[1];
        const filename = `${find_user.username}${find_user.id}.${file_ext}`;
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
    async getAvatar(user, res) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });
        if (find_user.avatar === "profile.png") {
            const absolutePath = path.join(__dirname, this.env_file.get('DEFAULT_AVATAR_PATH'), user.avatar);
            return res.sendFile(absolutePath);
        }
        else {
            const absolutePath = path.join(__dirname, this.env_file.get('AVATAR_PATH'), user.avatar);
            return res.sendFile(absolutePath);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map