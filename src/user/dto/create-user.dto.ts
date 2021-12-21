import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { Prop } from "@nestjs/mongoose";
import { Unique } from "../../../src/common/validator/unique.validator";

export class CreateUserDTO {
    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    @Unique('User')
    authUserId: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    email: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    refreshToken: string;
}