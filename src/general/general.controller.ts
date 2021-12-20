import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags, ApiExtraModels, ApiOkResponse, getSchemaPath, ApiParam } from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { IdParameterDTO } from '../../src/common/dto/id-parameter.dto';
import { Pagination } from '../../src/common/pagination/pagination';
import { LoginRequestDTO } from './dto/loginout-request.dto';

@ApiBearerAuth()
@ApiTags('General')
@Controller({ version: '1' })
export class GeneralController {
    constructor(
        private readonly service: GeneralService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    async getLoginUrl(@Body() loginRequest: LoginRequestDTO) {
        return await this.service.getLoginUrl(loginRequest);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout' })
    async getLogoutUrl(@Body() loginRequest: LoginRequestDTO) {
        return await this.service.getLogoutUrl(loginRequest);
    }
}
