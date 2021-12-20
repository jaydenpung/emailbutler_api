import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class FileDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    fileName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    storagePath: string;

    static mutation(data: any): any {
        if (!data) {
            return false;
        }

        if (Array.isArray(data)) {
            return data.map(child => {
                return this.mutation2(child);
            }) as FileDTO[]
        }

        return this.mutation2(data) as FileDTO;
    }

    static mutation2(fileDTO: FileDTO): FileDTO {
        const dto = new FileDTO();
        dto.fileName = fileDTO.fileName || null;
        dto.storagePath = fileDTO.storagePath || null;

        return dto;
    }
}