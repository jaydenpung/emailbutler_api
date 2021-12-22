import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { Prop } from "@nestjs/mongoose";

export class TokenUserDTO {
    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    userId: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    email: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    nickname: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    picture: string;

    static mutation(data: any): any {
        const dto = new TokenUserDTO();
        dto.userId = data.userId || null;
        dto.email = data.email || null;
        dto.nickname = data.nickname || null;
        dto.name = data.name || null;
        dto.picture = data.picture || null;

        return dto;
    }
}