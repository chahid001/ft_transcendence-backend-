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
exports.TfaService = void 0;
const common_1 = require("@nestjs/common");
const speakeasy = require("speakeasy");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_service_1 = require("../../user/user.service");
const qrcode = require("qrcode");
const config_1 = require("@nestjs/config");
let TfaService = class TfaService {
    constructor(prisma, userService, env_file) {
        this.prisma = prisma;
        this.userService = userService;
        this.env_file = env_file;
    }
    async generateTfaSecret(user) {
        const secret = speakeasy.generateSecret();
        const otpUrl = speakeasy.otpauthURL({
            secret: secret.ascii,
            label: user.email,
            issuer: this.env_file.get('APP_NAME'),
        });
        await this.userService.setTfaSecret(secret.base32, user.id);
        return otpUrl;
    }
    async generateQrCode(stream, optUrl) {
        return qrcode.toFileStream(stream, optUrl);
    }
    isTfaValid(TfaCode, user) {
        const base32secret = user.TfaSecret;
        const verify = speakeasy.totp.verify({
            secret: base32secret,
            encoding: this.env_file.get('ENCODING'),
            token: TfaCode,
        });
        return (verify);
    }
};
TfaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, user_service_1.UserService, config_1.ConfigService])
], TfaService);
exports.TfaService = TfaService;
//# sourceMappingURL=2fa.service.js.map