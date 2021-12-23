import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UrlRequestDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    authCode: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    redirectUrl: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    requestRefreshToken: boolean;
}