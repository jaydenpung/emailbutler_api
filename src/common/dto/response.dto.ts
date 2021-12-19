import { ApiProperty } from "@nestjs/swagger";

class Error {
    @ApiProperty()
    type: string;

    @ApiProperty()
    description: string;
}

export class ResponseDTO<T> {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    data: T[];

    @ApiProperty({ type: Error })
    error: Error;
}