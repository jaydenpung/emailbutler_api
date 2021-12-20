import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsBoolean, IsObject } from 'class-validator';
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
    storagePath: string;

    @ApiProperty()
    @Prop()
    @IsString()
    mailQuery: string;

    @ApiProperty()
    @Prop({ default: false })
    @IsBoolean()
    recurring: boolean;

    @ApiProperty()
    @Prop({ type: JobResultDTO })
    jobResults: JobResultDTO[];

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