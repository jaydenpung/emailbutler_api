import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsBoolean, IsArray, IsOptional, ValidateNested } from "class-validator";
import { Job } from "../schemas/job.schema";
import { Prop } from "@nestjs/mongoose";
import { JobResultDTO } from "./job-result.dto";
import { Type } from "class-transformer";

export class JobDTO {

    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @Prop()
    @IsString()
    authUserId: string;

    @ApiProperty()
    @Prop()
    @IsString()
    name: string;

    @ApiProperty()
    @Prop()
    @IsString()
    storagePath: string;

    @ApiProperty()
    @Prop()
    @IsString()
    mailQuery: string;

    @ApiProperty()
    @Prop({ default: false })
    @IsBoolean()
    recurring: boolean;

    @Prop({ type: [JobResultDTO] })
    @IsArray()
    @IsOptional()
    @Type(() => JobResultDTO )
    @ValidateNested({ each: true })
    jobResults: JobResultDTO[];

    @ApiProperty()
    @Prop()
    @IsDate()
    lastRunAt: Date;

    @ApiProperty()
    @Prop({ default: Date.now() })
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @Prop({ default: Date.now() })
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @Prop()
    @IsDate()
    deletedAt: Date;

    static mutation(job: Job): JobDTO {
        const dto = new JobDTO();
        dto.id = job.id,
        dto.authUserId = job.authUserId,
        dto.name = job.name,
        dto.storagePath = job.storagePath,
        dto.mailQuery = job.mailQuery,
        dto.recurring = job.recurring,
        dto.jobResults = job.jobResults;
        dto.lastRunAt = job.lastRunAt;
        dto.createdAt = job.createdAt;
        dto.updatedAt = job.updatedAt;
        dto.deletedAt = job.deletedAt;
        return dto;
    }
}