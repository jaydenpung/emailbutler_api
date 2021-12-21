import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { Prop } from "@nestjs/mongoose";

export class JobRunDTO {
    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    folderName: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    mailQuery: string;
}