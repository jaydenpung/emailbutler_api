import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { AuthUserDTO } from "../../../src/common/dto/auth-user.dto";

export class UserDTO {

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    nickname: string;

    @ApiProperty()
    @IsString()
    picture: string;

    static mutation(user: (UserDTO | AuthUserDTO)): UserDTO {
        const dto = new UserDTO();
        dto.email = user.email,
        dto.name = user.name,
        dto.nickname = user.nickname,
        dto.picture = user.picture;
        return dto;
    }
}