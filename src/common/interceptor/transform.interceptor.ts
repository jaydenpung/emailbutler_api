import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateUserDTO } from '../../../src/user/dto/update-user.dto';
import { UserService } from '../../../src/user/user.service';
import { AuthUserDTO } from '../dto/auth-user.dto';

export interface Response<T> {
    success: boolean;
    data: T;
    error: object;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    constructor(private userService: UserService) { }
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Response<T>>> {

        //*** Request***
        const request = context.switchToHttp().getRequest();
        const requestUser = request.user;
        
        // transform user in request to authUser
        if (requestUser) {
            const USER_NAMESPACE = `${process.env.AUTH0_AUDIENCE}/user`;
            const ROLE_NAMESPACE = `${process.env.AUTH0_AUDIENCE}/roles`;

            const userDetail = requestUser[USER_NAMESPACE]
            // request user attribute name changed after incoming intercept, hence need to ignore on outgoing
            if (userDetail) {
                const authUser = new AuthUserDTO();
                authUser.userId = userDetail.userId || null;
                authUser.googleUserId = userDetail.googleUserId || null;
                authUser.email = userDetail.email || null;
                authUser.nickname = userDetail.nickname || null;
                authUser.name = userDetail.name || null;
                authUser.picture = userDetail.picture || null;
                authUser.refreshToken = userDetail.refreshToken || null;

                authUser.roles = requestUser[ROLE_NAMESPACE] || null;
                authUser.permissions = requestUser.permissions || null;
                authUser.accessToken = request.headers.authorization?.replace(/^bearer\s+/i, '') || null;

                //check for refresh token
                if (authUser.refreshToken) {
                    // save to db
                    const updateUserDTO = new UpdateUserDTO();
                    updateUserDTO.authUserId = authUser.userId;
                    updateUserDTO.email = authUser.email;
                    updateUserDTO.refreshToken = authUser.refreshToken;

                    await this.userService.upsert(updateUserDTO)
                }

                request.user = authUser;
            }
        }

        //*** Response ***
        const contentType = context
            .switchToHttp()
            .getResponse()
            .getHeader('content-type');

        //TODO: for future catching all error, due to async refer to https://stackoverflow.com/questions/62017504/using-an-async-method-in-a-rxjs-nextobserver
        return next.handle().pipe(
            map((data: any) => {
                if (
                    contentType &&
                    contentType.indexOf('application/json') === -1
                ) {
                    return data;
                }

                return data && data.success
                    ? data
                    : { success: true, data, error: null };
            }),
        );
    }
}
