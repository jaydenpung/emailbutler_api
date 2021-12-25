import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsBoolean } from 'class-validator';
import { Document } from 'mongoose';
import { JobResultDTO } from '../dto/job-result.dto';

export type JobDocument = Job & Document;

@Schema()
export class Job extends Document {

    @ApiProperty()
    @Prop({ index: true })
    @IsString()
    authUserId: string;

    @ApiProperty()
    @Prop()
    @IsString()
    name: string;

    @ApiProperty()
    @Prop()
    @IsString()
    folderName: string;

    @ApiProperty()
    @Prop()
    @IsString()
    folderId: string;

    @ApiProperty()
    @Prop()
    @IsString()
    storagePath: string;

    @ApiProperty()
    @Prop()
    @IsString()
    mailQuery: string;

    @ApiProperty()
    @Prop({ default: true })
    @IsBoolean()
    recurring: boolean;

    @ApiProperty()
    @Prop({ type: JobResultDTO })
    jobResults: JobResultDTO[];

    @ApiProperty()
    @Prop()
    @IsString()
    status: string;

    @ApiProperty()
    @Prop()
    @IsDate()
    lastRunAt: Date;

    @ApiProperty()
    @Prop({ default: Date.now() })
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @Prop({ default: Date.now() })
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @Prop()
    @IsDate()
    deletedAt: Date;
}

const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({
    name: 'text'
});

export { JobSchema };