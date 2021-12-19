import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";
import { User } from "../schemas/user.schema";

export class UserDTO {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    static mutation(user: User): UserDTO {
        const dto = new UserDTO();
        dto.id = user.id,
        dto.name = user.name,
        dto.address = user.address,
        dto.createdAt = user.createdAt,
        dto.updatedAt = user.updatedAt
        return dto;
    }
}