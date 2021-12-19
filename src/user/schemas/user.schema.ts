import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
    @ApiProperty()
    @Prop()
    @IsString()
    name: string;

    @ApiProperty()
    @Prop()
    @IsString()
    address: string;

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

export const UserSchema = SchemaFactory.createForClass(User);