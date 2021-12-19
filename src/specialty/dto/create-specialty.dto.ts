import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Unique } from "../../../src/common/validator/unique.validator";

export class CreateSpecialtyDTO {
    @ApiProperty()
    @IsString()
    @Unique('Specialty')
    name: string;
}