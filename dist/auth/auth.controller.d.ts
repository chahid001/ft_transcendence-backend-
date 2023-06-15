import { AuthService } from "./auth.service";
import { LoginDto, SignUpDto } from "src/auth/dto";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { Request, Response } from "express";
import { TfaService } from "./2fa/2fa.service";
export declare class AuthController {
    private authService;
    private userService;
    private tfaService;
    constructor(authService: AuthService, userService: UserService, tfaService: TfaService);
    login(logindto: LoginDto, req: Request, res: Response): Promise<void>;
    register(regdto: SignUpDto): Promise<void>;
    SchoolRed(user: User): Promise<{
        access_token: string;
    }>;
    generateQrcode(user: User, res: Response): Promise<any>;
    turnOnTfa(user: User, body: any): Promise<void>;
    turnOffTfa(user: User, body: any): Promise<void>;
}
