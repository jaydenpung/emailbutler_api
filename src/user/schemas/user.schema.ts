import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {

    @ApiProperty()
    @Prop({ unique: true })
    @IsString()
    authUserId: string;
    
    @ApiProperty()
    @Prop()
    @IsEmail()
    email: string;

    @ApiProperty()
    @Prop()
    @IsString()
    refreshToken: string;

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