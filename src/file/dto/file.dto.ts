import { ApiProperty } from "@nestjs/swagger";

export class FileDTO {
    @ApiProperty()
    path: string;
}