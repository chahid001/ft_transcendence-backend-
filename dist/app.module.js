"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const auth_controller_1 = require("./auth/auth.controller");
const user_module_1 = require("./user/user.module");
const auth_service_1 = require("./auth/auth.service");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config");
const user_controller_1 = require("./user/user.controller");
const user_service_1 = require("./user/user.service");
const _2fa_service_1 = require("./auth/2fa/2fa.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, user_module_1.UserModule, prisma_module_1.PrismaModule, config_1.ConfigModule.forRoot({
                isGlobal: true
            })],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController],
        providers: [auth_service_1.AuthService, user_service_1.UserService, _2fa_service_1.TfaService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map