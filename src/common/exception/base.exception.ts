import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseException extends HttpException {
    constructor(message?: string) {
        super(message, HttpStatus.OK);
    }

    /**
     * @deprecated will cease after make sure no app is consuming this
     */

    abstract getType(): string;

    getResponse(): object {
        return {
            success: false,
            data: null,
            error: {
                type: this.getType(),
                description: this.message,
            },
        };
    }
}
