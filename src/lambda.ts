import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as express from "express";
import { useContainer } from 'class-validator';
import { UserService } from './user/user.service';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
 if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
    nestApp.use(eventContext());

    nestApp.enableCors();
    nestApp.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    nestApp.enableVersioning({
        type: VersioningType.URI,
    });
    
    useContainer(nestApp.select(AppModule), { fallbackOnErrors: true });

    const userService = await nestApp.get<UserService>(UserService);
    nestApp.useGlobalInterceptors(new TransformInterceptor(userService));

    nestApp.useGlobalFilters(new HttpExceptionFilter());

    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
 }
 return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
 cachedServer = await bootstrapServer();
 return proxy(cachedServer, event, context, 'PROMISE').promise;
}