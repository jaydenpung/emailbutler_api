import { Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose';

export type GeneralDocument = General & Document;

@Schema()
export class General { }

export const GeneralSchema = SchemaFactory.createForClass(General);