import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserDTO } from '../dto/auth-user.dto';

//change user detail in request data to expected format
export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as AuthUserDTO;
    },
);