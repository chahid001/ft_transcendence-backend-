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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const decorator_1 = require("./decorator");
const _42_guard_1 = require("./guard/42.guard");
const guard_1 = require("./guard");
const user_service_1 = require("../user/user.service");
const _2fa_service_1 = require("./2fa/2fa.service");
let AuthController = class AuthController {
    constructor(authService, userService, tfaService) {
        this.authService = authService;
        this.userService = userService;
        this.tfaService = tfaService;
    }
    async login(logindto, req, res) {
        const user = await this.authService.login(logindto);
        if (await this.userService.isTfaEnable(user.id)) {
            if (logindto.TfaCode === undefined)
                throw new common_1.ForbiddenException("Please provide a 2FA code");
            const isValid = this.tfaService.isTfaValid(logindto.TfaCode, user);
            if (!isValid)
                throw new common_1.ForbiddenException("incorrect 2FA code");
            delete user.TfaSecret;
            await this.userService.onlineStats(user);
            const token = await this.authService.sign_token(user.id, user.username);
            res.cookie('token', token, {
                httpOnly: true,
            });
            res.status(200).json({ msg: 'Logged succefully' });
        }
        await this.userService.onlineStats(user);
        delete user.TfaSecret;
        const token = await this.authService.sign_token(user.id, user.username);
        res.cookie('token', token, {
            httpOnly: true,
        });
        console.log(token);
        res.status(200).json({ msg: 'Logged succefully' });
    }
    register(regdto) {
        return this.authService.register(regdto);
    }
    async SchoolRed(user) {
        await this.userService.onlineStats(user);
        return this.authService.sign_token(user.id, user.username);
    }
    async generateQrcode(user, res) {
        const otpUrl = await this.tfaService.generateTfaSecret(user);
        return this.tfaService.generateQrCode(res, otpUrl);
    }
    async turnOnTfa(user, body) {
        if (!body.TfaCode)
            throw new common_1.UnauthorizedException('Please enter the 2fa code');
        const isValid = this.tfaService.isTfaValid(body.TfaCode, user);
        if (!isValid)
            throw new common_1.UnauthorizedException('Wrong authentication code');
        this.userService.turnOnTfa(user);
    }
    async turnOffTfa(user, body) {
        if (!body.TfaCode)
            throw new common_1.UnauthorizedException('Please enter the 2fa code');
        const isValid = this.tfaService.isTfaValid(body.TfaCode, user);
        if (!isValid)
            throw new common_1.UnauthorizedException('Wrong authentication code');
        this.userService.turnOffTfa(user);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignUpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('42/redirect'),
    (0, common_1.UseGuards)(_42_guard_1.SchoolGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SchoolRed", null);
__decorate([
    (0, common_1.Get)('2fa/generate'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateQrcode", null);
__decorate([
    (0, common_1.Post)('2fa/enable'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "turnOnTfa", null);
__decorate([
    (0, common_1.Post)('2fa/disable'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "turnOffTfa", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        _2fa_service_1.TfaService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map