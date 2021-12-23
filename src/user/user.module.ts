import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '../../src/common/interceptor/transform.interceptor';

@Module({
    providers: [
        UserService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor
        }
    ],
    controllers: [UserController],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
})
export class UserModule { }
