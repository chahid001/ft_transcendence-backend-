/// <reference types="multer" />
import { User } from "@prisma/client";
import { UserService } from "./user.service";
import { NameDto, NewPassDto, UsernameDto } from "src/auth/dto";
import { Response } from "express";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): User;
    updateAvatar(avatar: Express.Multer.File, user: User): void;
    getAvatar(user: User, res: Response): Promise<void>;
    changePass(user: User, newpassdto: NewPassDto): Promise<void>;
    changeUsername(user: User, usernamedto: UsernameDto): Promise<void>;
    changeName(user: User, name: NameDto): Promise<void>;
    playing(user: User): Promise<void>;
    logout(user: User): Promise<void>;
}
