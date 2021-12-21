import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";
import { User } from "../schemas/user.schema";

export class UserSchemaDTO {

    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    authUserId: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    refreshToken: string;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @IsDate()
    deletedAt: Date;

    static mutation(user: User): UserSchemaDTO {
        const dto = new UserSchemaDTO();
        dto.id = user.id,
        dto.authUserId = user.authUserId,
        dto.email = user.email,
        dto.refreshToken = user.refreshToken,
        dto.createdAt = user.updatedAt,
        dto.updatedAt = user.updatedAt,
        dto.deletedAt = user.deletedAt;
        return dto;
    }
}