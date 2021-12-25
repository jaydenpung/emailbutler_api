import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsArray, ValidateNested, IsString, IsInt } from "class-validator";
import { FileDTO as FileDTO } from "./file.dto";

export class JobResultDTO {

    @ApiProperty()
    @IsString()
    @IsOptional()
    emailTitle: string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    emailDate: Date;

    @Prop({ type: [FileDTO] })
    @IsArray()
    @IsOptional()
    @Type(() => FileDTO )
    @ValidateNested({ each: true })
    files: FileDTO[];

    @ApiProperty()
    @IsInt()
    @IsOptional()
    runTime: number;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    createdAt: Date;

    static mutation(data: any): any {
        if (!data) {
            return false;
        }

        if (Array.isArray(data)) {
            return data.map(child => {
                return this.mutation2(child);
            }) as JobResultDTO[]
        }

        return this.mutation2(data) as JobResultDTO;
    }

    static mutation2(jobResultDTO: JobResultDTO): JobResultDTO {
        const dto = new JobResultDTO();
        dto.emailTitle = jobResultDTO.emailTitle || null;
        dto.emailDate = jobResultDTO.emailDate || null;
        dto.files = FileDTO.mutation(jobResultDTO.files) || [];
        dto.runTime = jobResultDTO.runTime || null;
        dto.createdAt = jobResultDTO.createdAt || new Date();

        return dto;
    }
}