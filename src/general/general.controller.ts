import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { UrlRequestDTO } from './dto/url-request.dto';

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

    @Post('requestPermission')
    @ApiOperation({ summary: 'Request additional google permission' })
    async requestPermission(@Body() urlRequest: UrlRequestDTO) {
        return await this.service.getGooglePermissionUrl(urlRequest);
    }
}
