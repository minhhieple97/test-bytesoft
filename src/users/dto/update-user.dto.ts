import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email:string;

    @IsString()
    @IsOptional()
    password:string;
}