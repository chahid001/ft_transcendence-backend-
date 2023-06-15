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
exports.SchoolStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const prisma_service_1 = require("../../../prisma/prisma.service");
const username_service_1 = require("../username.service");
let SchoolStrategy = class SchoolStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(env_file, prisma, generator) {
        super({
            clientID: env_file.get('USER_ID'),
            clientSecret: env_file.get('USER_SECRET'),
            callbackURL: env_file.get('CALLBACK_42'),
        });
        this.env_file = env_file;
        this.prisma = prisma;
        this.generator = generator;
    }
    async validate(accessToken, refreshToken, profile) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: profile.emails[0].value,
            },
        });
        if (!user) {
            console.log(profile);
            const new_user = await this.prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    username: await this.generator.UsernameGen(profile.name.givenName, profile.name.familyName),
                    provider: '42',
                },
            });
            return new_user;
        }
        return user;
    }
};
SchoolStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, prisma_service_1.PrismaService, username_service_1.UsernameService])
], SchoolStrategy);
exports.SchoolStrategy = SchoolStrategy;
//# sourceMappingURL=42.strategy.js.map