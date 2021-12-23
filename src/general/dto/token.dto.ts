import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class TokenDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    accessToken: string;
}