import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { UsernameService } from "./strategy/username.service";
import { SchoolStrategy } from "./strategy/42/42.strategy";
import { TfaService } from "./2fa/2fa.service";
import { UserService } from "src/user/user.service";

@Module({
    imports: [JwtModule.register({global: true})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UsernameService,
         SchoolStrategy, UserService, TfaService],
})

export class AuthModule {}