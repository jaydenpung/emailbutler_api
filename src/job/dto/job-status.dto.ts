import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Job } from "../schemas/job.schema";
import { Prop } from "@nestjs/mongoose";
import { JobStatus } from "../../../src/common/enum/job-status.enum";

export class JobStatusDTO {

    @ApiProperty()
    @Prop()
    @IsString()
    status: string;

    static mutation(job: Job): JobStatusDTO {
        const dto = new JobStatusDTO();
        dto.status = job.status || JobStatus.NORMAL;
        return dto;
    }
}