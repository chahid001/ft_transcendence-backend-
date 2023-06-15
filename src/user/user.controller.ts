import { BadRequestException, Body, Controller, FileTypeValidator, ForbiddenException, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Req, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserService } from "./user.service";
import { NameDto, NewPassDto, UsernameDto } from "src/auth/dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";


@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    //update avatar
    @Patch('/upload/avatar')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor("avatar", {
        dest: './src/avatars/uploads',
        limits: {
            fileSize: 1024 * 1024 * 4
        },
        fileFilter: (req, file, callback) => {
            const allowedExtensions = /\.(jpg|jpeg|png)$/;
            if (!allowedExtensions.test(file.originalname)) {
                callback(new BadRequestException('Only JPEG/JPG and PNG files are allowed.'), false);
            }
            else {
                callback(null, true);
            }
            
        },
    }))
    updateAvatar(@UploadedFile() avatar: Express.Multer.File, @GetUser() user: User) {
        this.userService.updateAvatar(avatar, user);
    }

    //get avatar
    @Get('my-avatar')
    @UseGuards(JwtGuard)
    getAvatar(@GetUser() user: User, @Res() res: Response) {
        return this.userService.getAvatar(user, res);
    }

    //Change password
    @Patch('me/settings/new-password')
    @UseGuards(JwtGuard)
    async changePass(@GetUser() user: User, @Body() newpassdto: NewPassDto) {
        const isPassValid = await this.userService.isPassValid(newpassdto, user);
        if (!isPassValid)
            throw new ForbiddenException("incorrect password");
        await this.userService.setNewPass(newpassdto, user);
    }

    //change username
    @Patch('me/settings/change-username')
    @UseGuards(JwtGuard)
    async changeUsername(@GetUser() user: User, @Body() usernamedto: UsernameDto) {
        await this.userService.changeUsername(user, usernamedto);
    }

    //Change name
    @Patch('me/settings/change-name')
    @UseGuards(JwtGuard)
    async changeName(@GetUser() user: User, @Body() name: NameDto) {
        await this.userService.changeName(user, name);
    }

    //play status
    @Get('in-game')
    @UseGuards(JwtGuard)
    async playing(@GetUser() user: User) {
        await this.userService.ongameStats(user);
    }

    //offline status
    @Get('logout')
    @UseGuards(JwtGuard)
    async logout(@GetUser() user: User) {
        await this.userService.offlineStats(user);
    }
}