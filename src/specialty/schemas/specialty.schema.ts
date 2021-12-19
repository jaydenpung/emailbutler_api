import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type SpecialtyDocument = Specialty & Document;

@Schema()
export class Specialty extends Document {

    @ApiProperty()
    @Prop()
    @IsString()
    name: string;

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

const SpecialtySchema = SchemaFactory.createForClass(Specialty);

SpecialtySchema.index({
    name: 'text'
});

export { SpecialtySchema };