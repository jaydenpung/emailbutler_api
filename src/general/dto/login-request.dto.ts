import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class LoginRequestDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    redirectUrl: string;
}