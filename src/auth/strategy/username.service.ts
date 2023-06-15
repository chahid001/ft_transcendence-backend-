import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsernameService {
    constructor(private prisma: PrismaService) {}

    async UsernameGen(firstname: string, lastname: string): Promise<string> {
        let username: string;

        username = firstname[0] + lastname;
        username = username.toLowerCase();
        const exist_username = await this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (exist_username) {
            let i: number = 0;
            let unique_username: string;
            
            if (i < 10)
                unique_username = `${username}${0}${i}`
            else
                unique_username = `${username}${i}`
            while (await this.prisma.user.findUnique({
                where: {
                    username: unique_username,
                },
            })) {
                i++;
                unique_username = `${username}${i}`
            }
            username = unique_username;
        }
        return username;
    }
}
