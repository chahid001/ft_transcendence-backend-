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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const user_service_1 = require("./user.service");
const dto_1 = require("../auth/dto");
const platform_express_1 = require("@nestjs/platform-express");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getMe(user) {
        return user;
    }
    updateAvatar(avatar, user) {
        this.userService.updateAvatar(avatar, user);
    }
    getAvatar(user, res) {
        return this.userService.getAvatar(user, res);
    }
    async changePass(user, newpassdto) {
        const isPassValid = await this.userService.isPassValid(newpassdto, user);
        if (!isPassValid)
            throw new common_1.ForbiddenException("incorrect password");
        await this.userService.setNewPass(newpassdto, user);
    }
    async changeUsername(user, usernamedto) {
        await this.userService.changeUsername(user, usernamedto);
    }
    async changeName(user, name) {
        await this.userService.changeName(user, name);
    }
    async playing(user) {
        await this.userService.ongameStats(user);
    }
    async logout(user) {
        await this.userService.offlineStats(user);
    }
};
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('/upload/avatar'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("avatar", {
        dest: './src/avatars/uploads',
        limits: {
            fileSize: 1024 * 1024 * 4
        },
        fileFilter: (req, file, callback) => {
            const allowedExtensions = /\.(jpg|jpeg|png)$/;
            if (!allowedExtensions.test(file.originalname)) {
                callback(new common_1.BadRequestException('Only JPEG/JPG and PNG files are allowed.'), false);
            }
            else {
                callback(null, true);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateAvatar", null);
__decorate([
    (0, common_1.Get)('my-avatar'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Patch)('me/settings/new-password'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.NewPassDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePass", null);
__decorate([
    (0, common_1.Patch)('me/settings/change-username'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UsernameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeUsername", null);
__decorate([
    (0, common_1.Patch)('me/settings/change-name'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.NameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeName", null);
__decorate([
    (0, common_1.Get)('in-game'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "playing", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map