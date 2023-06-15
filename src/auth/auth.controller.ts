import { Body, Controller, ForbiddenException, Get, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignUpDto } from "src/auth/dto";
import { GetUser } from "./decorator";
import { User } from "@prisma/client";
import { SchoolGuard } from "./guard/42.guard";
import { JwtGuard } from "./guard";
import { UserService } from "src/user/user.service";
import { Request, Response } from "express";
import { TfaService } from "./2fa/2fa.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UserService,
        private tfaService: TfaService) {}

    //Login
    @Post('login')
    async login(@Body() logindto: LoginDto, @Req() req: Request, @Res() res: Response) {
        const user = await this.authService.login(logindto);
        if (await this.userService.isTfaEnable(user.id)) {
            if (logindto.TfaCode === undefined)
                throw new ForbiddenException("Please provide a 2FA code");
            const isValid = this.tfaService.isTfaValid(logindto.TfaCode, user);
            if (!isValid)
                throw new ForbiddenException("incorrect 2FA code");
            delete user.TfaSecret;
            await this.userService.onlineStats(user);
            const token = await this.authService.sign_token(user.id, user.username);
            res.cookie('token', token, {
                httpOnly: true,
              });
            res.status(200).json({msg: 'Logged succefully'});
        }
        await this.userService.onlineStats(user);
        delete user.TfaSecret;
        const token  =  await this.authService.sign_token(user.id, user.username);
        res.cookie('token', token, {
            httpOnly: true,
          });
        console.log(token);
        res.status(200).json({msg: 'Logged succefully'});
    }

    //Register
    @Post('signup')
    register(@Body() regdto: SignUpDto) {
        return this.authService.register(regdto);
    }

    //42 oAuth
    @Get('42/redirect')
    @UseGuards(SchoolGuard)
    async SchoolRed(@GetUser() user: User) {
        await this.userService.onlineStats(user);
        return this.authService.sign_token(user.id, user.username);
    }

    //generate Qrcode
    @Get('2fa/generate')
    @UseGuards(JwtGuard)
    async generateQrcode(@GetUser() user: User, @Res() res: Response) {
        const otpUrl = await this.tfaService.generateTfaSecret(user);
        return this.tfaService.generateQrCode(res, otpUrl);
    }
    
    //turn on 2fa
    @Post('2fa/enable')
    @UseGuards(JwtGuard)
    async turnOnTfa(@GetUser() user: User, @Body() body ) {
        if (!body.TfaCode)
            throw new UnauthorizedException('Please enter the 2fa code');
        const isValid = this.tfaService.isTfaValid(body.TfaCode, user);
        if (!isValid)
            throw new UnauthorizedException('Wrong authentication code');
        this.userService.turnOnTfa(user);
    }

    //turn off 2fa
    @Post('2fa/disable')
    @UseGuards(JwtGuard)
    async turnOffTfa(@GetUser() user: User, @Body() body ) {
        if (!body.TfaCode)
            throw new UnauthorizedException('Please enter the 2fa code');
        const isValid = this.tfaService.isTfaValid(body.TfaCode, user);
        if (!isValid)
            throw new UnauthorizedException('Wrong authentication code');
        this.userService.turnOffTfa(user);
    }
}