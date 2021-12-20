import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsDate, IsBoolean } from "class-validator";
import { Prop } from "@nestjs/mongoose";

export class EmailDTO {
    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    subject: string;

    @ApiProperty()
    @Prop()
    @IsString()
    @IsOptional()
    snippet: string;

    @ApiProperty()
    @Prop()
    @IsBoolean()
    @IsOptional()
    hasAttachment: boolean;

    @ApiProperty()
    @Prop()
    @IsDate()
    @IsOptional()
    date: Date;

    static mutation(data: any): any {
        if (!data) {
            return false;
        }

        if (Array.isArray(data)) {
            return data.map(child => {
                return this.mutation2(child);
            }) as EmailDTO[]
        }

        return this.mutation2(data) as EmailDTO;
    }

    static mutation2(emailDTO: EmailDTO): EmailDTO {
        const dto = new EmailDTO();
        dto.subject = emailDTO.subject || null;
        dto.snippet = emailDTO.snippet || null;
        dto.hasAttachment = emailDTO.hasAttachment || null;
        dto.date = emailDTO.date || new Date();

        return dto;
    }
}