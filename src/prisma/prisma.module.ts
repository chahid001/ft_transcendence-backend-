import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { GLOBAL_MODULE_METADATA } from "@nestjs/common/constants";

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})

export class PrismaModule {}