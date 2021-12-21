import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UrlRequestDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    redirectUrl: string;
}