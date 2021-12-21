import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Query,
    UseGuards,
    Req
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../permissions.decorator';
import { PermissionsGuard } from '../permissions.guard';
import { User } from './schemas/user.schema';
import { UserQueryParameter } from './query-parameter/user-query-parameter';
import { UserQueryParameterDTO } from './dto/user-query-parameter.dto';
import { Pagination } from '../../src/common/pagination/pagination';

@ApiExtraModels(User)
@ApiBearerAuth()
@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
    constructor(private readonly service: UserService) { }

    @Get()
    @ApiOperation({ summary: 'Read many users' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:user')
    async index(@Query() queryParameters: UserQueryParameterDTO) {
        const queryFilter = new UserQueryParameter(queryParameters);

        const result = await this.service.findAll(queryFilter);
        if (queryFilter.hasPaginationMeta()) {
            return result as Pagination;
        }

        return result;
    }

    @Get('me')
    @ApiOperation({ summary: 'Get user profile from token' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:user')
    async me(@Req() request) {
        const userDetail = request.user[`${process.env.AUTH0_AUDIENCE}userDetail`]

        return userDetail;
    }

    @Post('realme')
    @ApiOperation({ summary: 'Get user profile via api call' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:user')
    async realme(@Req() request) {
        const userDetail = request.user[`${process.env.AUTH0_AUDIENCE}userDetail`]
        const user = await this.service.findOne(userDetail);

        return user;
    }
}
