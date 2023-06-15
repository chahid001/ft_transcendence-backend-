import { ConfigService } from "@nestjs/config";
import { profile } from "passport-42";
import { PrismaService } from "src/prisma/prisma.service";
import { UsernameService } from "../username.service";
declare const SchoolStrategy_base: new (...args: any[]) => any;
export declare class SchoolStrategy extends SchoolStrategy_base {
    private env_file;
    private prisma;
    private generator;
    constructor(env_file: ConfigService, prisma: PrismaService, generator: UsernameService);
    validate(accessToken: string, refreshToken: string, profile: profile): Promise<import(".prisma/client").User>;
}
export {};
