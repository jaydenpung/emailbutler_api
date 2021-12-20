import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsArray, IsOptional, ValidateNested, IsDate } from "class-validator";
import { Prop } from "@nestjs/mongoose";
import { JobResultDTO } from "./job-result.dto";
import { Type } from "class-transformer";

export class CreateJobDTO {
    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    storagePath: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    mailQuery: string;

    @ApiProperty()
    @Prop({ default: false })
    @IsBoolean()
    @IsOptional()
    recurring: boolean;

    @Prop({ type: [JobResultDTO] })
    @IsArray()
    @IsOptional()
    @Type(() => JobResultDTO )
    @ValidateNested({ each: true })
    jobResults: JobResultDTO[];
}