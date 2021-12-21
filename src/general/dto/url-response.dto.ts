import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UrlResponseDTO {
    @ApiProperty()
    @IsString()
    url: string;
}