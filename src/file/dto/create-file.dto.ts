import { Prop } from "@nestjs/mongoose";
import { IsString } from "class-validator";

export class CreateFileDTO {
    @Prop()
    @IsString()
    folder: string
}