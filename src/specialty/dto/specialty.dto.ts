import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate } from "class-validator";
import { Specialty } from "../schemas/specialty.schema";

export class SpecialtyDTO {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @IsDate()
    deletedAt: Date;

    static mutation(specialty: Specialty): SpecialtyDTO {
        const dto = new SpecialtyDTO();
        dto.id = specialty.id,
        dto.name = specialty.name;
        dto.createdAt = specialty.createdAt;
        dto.updatedAt = specialty.updatedAt;
        dto.deletedAt = specialty.deletedAt;
        return dto;
    }
}