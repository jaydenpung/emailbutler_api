import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";
import { User } from "../schemas/user.schema";

export class UserDTO {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    authUserId: string;

    @ApiProperty()
    @IsString()
    refreshToken: string;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    static mutation(user: User): UserDTO {
        const dto = new UserDTO();
        dto.id = user.id,
        dto.email = user.email,
        dto.refreshToken = user.refreshToken,
        dto.authUserId = user.authUserId,
        dto.createdAt = user.createdAt,
        dto.updatedAt = user.updatedAt
        return dto;
    }
}