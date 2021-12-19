import {
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

@ApiBearerAuth()
@ApiTags('General')
@Controller({ version: '1' })
export class GeneralController {
    constructor(
        private readonly service: GeneralService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    async getLoginUrl() {
        return await this.service.getLoginUrl();
    }
}
