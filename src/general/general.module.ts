import { Module } from '@nestjs/common';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { General, GeneralSchema } from './schemas/general.schema';
import { User, UserSchema } from '../../src/user/schemas/user.schema';

@Module({
    providers: [GeneralService],
    controllers: [GeneralController],
    imports: [
        MongooseModule.forFeature([
            { name: General.name, schema: GeneralSchema },
            { name: User.name, schema: UserSchema }
        ]),
    ],
})
export class GeneralModule { }
