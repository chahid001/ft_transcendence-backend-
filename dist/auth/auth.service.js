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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, jwt, env_config, userService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.env_config = env_config;
        this.userService = userService;
    }
    async register(regdto) {
        const hash_pass = await argon.hash(regdto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: regdto.email,
                    username: regdto.username,
                    hash: hash_pass,
                    firstname: regdto.firstname,
                    lastname: regdto.lastname,
                },
            });
        }
        catch (e) {
            if (e.code === 'P2002') {
                throw new common_1.ConflictException('username or email already taken');
            }
        }
    }
    async login(logindto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: logindto.identifier },
                    { username: logindto.identifier },
                ],
            },
        });
        if (!user)
            throw new common_1.ForbiddenException("Invalid username or email");
        const pass = await argon.verify(user.hash, logindto.password);
        if (!pass)
            throw new common_1.ForbiddenException("Incorrect password");
        delete user.hash;
        return user;
    }
    async sign_token(user_id, username) {
        const data = {
            sub: user_id,
            username,
        };
        const secret_jwt = this.env_config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(data, {
            expiresIn: '1h',
            secret: secret_jwt,
        });
        return {
            access_token: token,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService,
        config_1.ConfigService, user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map