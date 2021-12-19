import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';

@Module({
    providers: [FileService],
    controllers: [FileController],
    imports: [
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    ],
})
export class FileModule { }
