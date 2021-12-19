import { Module } from '@nestjs/common';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { General, GeneralSchema } from './schemas/general.schema';

@Module({
    providers: [GeneralService],
    controllers: [GeneralController],
    imports: [
        MongooseModule.forFeature([
            { name: General.name, schema: GeneralSchema }
        ]),
    ],
})
export class GeneralModule { }
