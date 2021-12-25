import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { config as awsConfig } from 'aws-sdk';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { useContainer } from 'class-validator';
import { UserService } from './user/user.service';

function initSwagger(app: INestApplication): void {
    const documentBuilder = new DocumentBuilder()
        .setTitle(`${process.env.APP_NAME} Documentation`)
        .setDescription('Auto generated by swagger')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, documentBuilder, {});

    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            defaultModelsExpandDepth: -1,
            tryItOutEnabled: true
        }
    });
}

async function bootstrap(): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule);

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const userService = await app.get<UserService>(UserService);
    app.useGlobalInterceptors(new TransformInterceptor(userService));

    app.useGlobalFilters(new HttpExceptionFilter());

    /* AWS */
    awsConfig.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    /* Swagger */
    if (process.env.NODE_ENV !== 'production') {
        initSwagger(app);
    }

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
