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

    static mutation2(medicalCondition: JobResultDTO): JobResultDTO {
        const dto = new JobResultDTO();
        dto.fileName = medicalCondition.fileName || null;
        dto.storagePath = medicalCondition.storagePath || null;
        dto.createdAt = medicalCondition.createdAt || null;
        dto.updatedAt = medicalCondition.updatedAt || null;
        dto.deletedAt = medicalCondition.deletedAt || null;

        return dto;
    }
}