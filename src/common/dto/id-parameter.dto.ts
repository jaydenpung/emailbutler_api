import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";
import { Types } from 'mongoose';

export class IdParameterDTO {
    @IsMongoId()
    id: Types.ObjectId;
}