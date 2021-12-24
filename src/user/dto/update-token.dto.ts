import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { Prop } from "@nestjs/mongoose";
import { AuthCodeType } from "../../../src/common/enum/auth-code-type.enum";

export class UpdateTokenDTO {
    @ApiProperty()
    @Prop()
    @IsString()
    authCode: string;

    @ApiProperty()
    @Prop()
    @IsEnum(AuthCodeType)
    type: AuthCodeType;

    @ApiProperty()
    @Prop()
    @IsString()
    redirectUrl: string;
}