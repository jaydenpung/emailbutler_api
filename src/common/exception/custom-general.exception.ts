import { CommonException } from "./common.exception";

export class CustomGeneralException extends CommonException {
    constructor(readonly message: string) {
        super(message);
    }
}
