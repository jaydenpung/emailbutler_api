import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
    @Prop()
    link: string;

    @Prop()
    key: string;

    @Prop({ default: Date.now() })
    createdAt: Date;

    @Prop({ default: Date.now() })
    updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);