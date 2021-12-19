import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthzModule } from './authz/authz.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialtyModule } from './specialty/specialty.module';
import { RouterModule } from '@nestjs/core';
import { GeneralModule } from './general/general.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { UniqueConstraint } from './common/validator/unique.validator';

@Module({
    imports: [
        ConfigModule.forRoot({ // refer https://docs.nestjs.com/techniques/configuration
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.MONGODB_ENDPOINT),
        RouterModule.register([
            {
                path: '',
                module: GeneralModule
            }
        ]),
        AuthzModule,
        SpecialtyModule,
        GeneralModule,
        FileModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService, UniqueConstraint],
})
export class AppModule { }
