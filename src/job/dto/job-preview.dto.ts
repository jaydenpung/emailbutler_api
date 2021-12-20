import { IsOptional, IsArray, ValidateNested } from "class-validator";
import { Prop } from "@nestjs/mongoose";
import { EmailDTO } from "./email.dto";
import { Type } from "class-transformer";

export class JobPreviewDTO {

    @Prop({ type: [EmailDTO] })
    @IsArray()
    @IsOptional()
    @Type(() => EmailDTO )
    @ValidateNested({ each: true })
    emails: EmailDTO[];

    static mutation(jobPreview: JobPreviewDTO): JobPreviewDTO {
        const dto = new JobPreviewDTO();
        dto.emails = EmailDTO.mutation(jobPreview.emails) || [];
        return dto;
    }
}