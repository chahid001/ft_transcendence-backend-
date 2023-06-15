import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { LoginDto, SignUpDto } from "src/auth/dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService,
        private env_config: ConfigService, private userService: UserService) {}

    async register(regdto: SignUpDto) {
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
            if (e.code === 'P2002'){
                throw new ConflictException('username or email already taken');
            }
        }
    }

    async login(logindto: LoginDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                        {email: logindto.identifier},
                        {username: logindto.identifier},
                    ],
                },
            });
        if (!user)
            throw new ForbiddenException("Invalid username or email");
        const pass = await argon.verify(user.hash, logindto.password);
        if (!pass)
            throw new ForbiddenException("Incorrect password");
        delete user.hash;
        return user;
    }

    async sign_token(user_id: number, username: string): Promise<{access_token: string}> {
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
        }
    }
}