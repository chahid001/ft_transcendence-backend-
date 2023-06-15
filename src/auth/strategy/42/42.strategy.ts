import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, profile } from "passport-42";
import { PrismaService } from "src/prisma/prisma.service";
import { UsernameService } from "../username.service";

@Injectable()
export class SchoolStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private env_file: ConfigService, private prisma: PrismaService, private generator: UsernameService) {
        super({
            clientID: env_file.get('USER_ID'),
            clientSecret: env_file.get('USER_SECRET'),
            callbackURL: env_file.get('CALLBACK_42'),
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: profile) {
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
}