import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private env_config;
    private prisma;
    constructor(env_config: ConfigService, prisma: PrismaService);
    validate(payload: {
        id: number;
        username: string;
    }): Promise<import(".prisma/client").User>;
}
export {};
