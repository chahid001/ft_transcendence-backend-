import { LoginDto, SignUpDto } from "src/auth/dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private prisma;
    private jwt;
    private env_config;
    private userService;
    constructor(prisma: PrismaService, jwt: JwtService, env_config: ConfigService, userService: UserService);
    register(regdto: SignUpDto): Promise<void>;
    login(logindto: LoginDto): Promise<import(".prisma/client").User>;
    sign_token(user_id: number, username: string): Promise<{
        access_token: string;
    }>;
}
