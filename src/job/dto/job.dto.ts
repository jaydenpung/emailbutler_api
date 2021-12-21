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
    folderName: string;

    @ApiProperty()
    @Prop()
    @IsString()
    folderId: string;

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
        dto.id = job.id || null,
        dto.authUserId = job.authUserId || null,
        dto.name = job.name || null,
        dto.folderName = job.folderName || null,
        dto.folderId = job.folderId || null,
        dto.storagePath = job.storagePath || null,
        dto.mailQuery = job.mailQuery || null,
        dto.recurring = job.recurring || null,
        dto.jobResults = JobResultDTO.mutation(job.jobResults) || [];
        dto.lastRunAt = job.lastRunAt || null;
        dto.createdAt = job.createdAt || null;
        dto.updatedAt = job.updatedAt || null;
        dto.deletedAt = job.deletedAt || null;
        return dto;
    }
}