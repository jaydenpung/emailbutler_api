import { ApiProperty } from "@nestjs/swagger";
import { Prop } from "@nestjs/mongoose";

export class AuthUserDTO { //for internal use only, do not return to user!
    @ApiProperty()
    @Prop()
    userId: string;

    @ApiProperty()
    @Prop()
    googleUserId: string;

    @ApiProperty()
    @Prop()
    email: string;

    @ApiProperty()
    @Prop()
    nickname: string;

    @ApiProperty()
    @Prop()
    name: string;

    @ApiProperty()
    @Prop()
    picture: string;

    @ApiProperty()
    @Prop()
    permissions: string[];

    @ApiProperty()
    @Prop()
    roles: string[];

    @ApiProperty()
    @Prop()
    accessToken: string;

    @ApiProperty()
    @Prop()
    refreshToken: string;
}