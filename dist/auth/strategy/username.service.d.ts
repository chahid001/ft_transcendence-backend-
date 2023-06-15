import { PrismaService } from "src/prisma/prisma.service";
export declare class UsernameService {
    private prisma;
    constructor(prisma: PrismaService);
    UsernameGen(firstname: string, lastname: string): Promise<string>;
}
