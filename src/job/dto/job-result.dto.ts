import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsOptional } from "class-validator";

export class JobResultDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    fileName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    storagePath: string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    updatedAt: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    deletedAt: Date;
}