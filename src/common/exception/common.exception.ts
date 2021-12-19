import { BaseException } from './base.exception';

export abstract class CommonException extends BaseException {
    getType() {
        return 'Exception';
    }
}
