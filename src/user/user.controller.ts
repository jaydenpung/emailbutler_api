import {
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
    Req,
    Body,
    Delete,
    Param,
    Patch
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../permissions.guard';
import { User } from './schemas/user.schema';
import { UserQueryParameter } from './query-parameter/user-query-parameter';
import { UserQueryParameterDTO } from './dto/user-query-parameter.dto';
import { Pagination } from '../../src/common/pagination/pagination';
import { IdParameterDTO } from '../../src/common/dto/id-parameter.dto';
import { CreateUserDTO } from '../../src/user/dto/create-user.dto';
import { UpdateUserDTO } from '../../src/user/dto/update-user.dto';
import { UserSchemaDTO } from './dto/user-schema.dto';

@ApiExtraModels(User)
@ApiBearerAuth()
@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
    constructor(private readonly service: UserService) { }

    @Get('')
    @ApiOperation({ summary: 'Read many users' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:user')
    async index(@Query() queryParameters: UserQueryParameterDTO) {
        const queryFilter = new UserQueryParameter(queryParameters);

        const result = await this.service.findAll(queryFilter);
        if (queryFilter.hasPaginationMeta()) {
            return result as Pagination;
        }

        return (result as User[]).map<UserSchemaDTO>(UserSchemaDTO.mutation);
    }

    @Post()
    @ApiOperation({ summary: 'Create user' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('create:user')
    async create(@Body() createUserDto: CreateUserDTO) {
        const user = await this.service.create(createUserDto);

        return UserSchemaDTO.mutation(user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Read user' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:user')
    async find(@Param() { id }: IdParameterDTO) {
        const user = await this.service.findOne(id);

        return UserSchemaDTO.mutation(user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update user' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('update:user')
    async update(@Param() { id }: IdParameterDTO, @Body() updateUserDTO: UpdateUserDTO) {
        const user = await this.service.update(id, updateUserDTO);

        return UserSchemaDTO.mutation(user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:user')
    async delete(@Param() { id }: IdParameterDTO) {
        const user = await this.service.delete(id);

        return UserSchemaDTO.mutation(user);
    }

    @Get('auth/list')
    @ApiOperation({ summary: 'Read many users via auth0 m2m' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:user')
    async authList(@Query() queryParameters: UserQueryParameterDTO) {
        const queryFilter = new UserQueryParameter(queryParameters);

        const result = await this.service.findAllFromApi(queryFilter);
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
        const userDetail = request.user[`${process.env.AUTH0_AUDIENCE}/user`]
        const user = await this.service.findOneFromToken(userDetail);

        return user;
    }

    @Post('realme')
    @ApiOperation({ summary: 'Get user profile via api call' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:user')
    async realme(@Req() request) {
        const userDetail = request.user[`${process.env.AUTH0_AUDIENCE}/user`]
        const user = await this.service.findOneFromApi(userDetail);

        return user;
    }
}
