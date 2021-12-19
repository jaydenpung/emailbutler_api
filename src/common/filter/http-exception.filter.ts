import {
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    Catch,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        if (status === 400) {
            response.status(200).json({
                success: false,
                data: null,
                error: {
                    type: 'Validation Exception',
                    description: exception.getResponse()['message'],
                },
            });
        }
        else {
            response.status(status).json(exception.getResponse());
        }
    }
}
