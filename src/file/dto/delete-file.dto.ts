import { IsString } from "class-validator";
import { S3PathValid } from "../../../src/common/validator/s3Path.validator";

export class DeleteFileDTO {
    @IsString()
    @S3PathValid()
    path: string
}