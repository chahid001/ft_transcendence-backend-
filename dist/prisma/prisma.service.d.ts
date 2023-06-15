import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
export declare class PrismaService extends PrismaClient {
    private config_env;
    constructor(config_env: ConfigService);
}
