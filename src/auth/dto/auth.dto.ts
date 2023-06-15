import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, isStrongPassword } from "class-validator";

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsString()
    @IsNotEmpty()
    // @IsStrongPassword()
    password: string;

    @IsString()
    firstname: string;
    @IsString()
    lastname: string;
}

export class LoginDto {
    @IsOptional()
    TfaCode: string;
    
    @IsString()
    @IsNotEmpty()
    identifier: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class NewPassDto {
    @IsString()
    @IsNotEmpty()
    password: string
    @IsString()
    @IsNotEmpty()
    new_password: string
}

export class NameDto {
    @IsString()
    @IsNotEmpty()
    firstname: string
    @IsString()
    @IsNotEmpty()
    lastname: string
}

export class UsernameDto {
    @IsString()
    @IsNotEmpty()
    username: string
}