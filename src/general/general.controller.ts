import {
    Body,
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { UrlRequestDTO } from './dto/url-request.dto';
import { AuthUserDTO } from '../../src/common/dto/auth-user.dto';
import { AuthUser } from '../../src/common/decorator/auth-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../src/permissions.guard';
import { UpdateTokenDTO } from '../../src/user/dto/update-token.dto';

@ApiBearerAuth()
@ApiTags('General')
@Controller({ version: '1' })
export class GeneralController {
    constructor(
        private readonly service: GeneralService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    async getLoginUrl(@Body() urlRequest: UrlRequestDTO) {
        return await this.service.getLoginUrl(urlRequest);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout' })
    async getLogoutUrl(@Body() urlRequest: UrlRequestDTO) {
        return await this.service.getLogoutUrl(urlRequest);
    }

    @Post('checkGooglePermission')
    @ApiOperation({ summary: 'Request additional google permission' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    async requestPermission(@AuthUser() authUser: AuthUserDTO, @Body() urlRequest: UrlRequestDTO) {
        return await this.service.checkGooglePermissionUrl(authUser, urlRequest);
    }

    @Post('updateToken')
    @ApiOperation({ summary: 'Update User with new refresh token via google auth code' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:user')
    async updateToken(@AuthUser() authUser: AuthUserDTO, @Body() updateTokenDTO: UpdateTokenDTO) {
        return await this.service.updateRefreshToken(authUser, updateTokenDTO);
    }
}
