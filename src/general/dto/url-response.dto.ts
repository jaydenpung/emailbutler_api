import { ApiProperty } from "@nestjs/swagger";

export class UrlResponseDTO {
    @ApiProperty()
    url: string;
    
    @ApiProperty()
    isAuthenticated: boolean;
}