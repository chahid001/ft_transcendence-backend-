import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { use } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private env_config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env_config.get('JWT_SECRET'),
        });
    }
    async validate(payload: {id: number, username: string}) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.id,
                username: payload.username,
            },
        });
        return user;
    }
}