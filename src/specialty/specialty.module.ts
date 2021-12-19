import { Module } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Specialty, SpecialtySchema } from './schemas/specialty.schema';

@Module({
    providers: [SpecialtyService],
    controllers: [SpecialtyController],
    imports: [
        MongooseModule.forFeature([
            { name: Specialty.name, schema: SpecialtySchema }
        ]),
    ],
})
export class SpecialtyModule { }
