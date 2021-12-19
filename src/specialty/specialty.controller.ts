import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Query,
    UseGuards
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { CreateSpecialtyDTO } from './dto/create-specialty.dto';
import { UpdateSpecialtyDTO } from './dto/update-specialty.dto';
import { SpecialtyService } from './specialty.service';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../permissions.decorator';
import { PermissionsGuard } from '../permissions.guard';
import { Specialty } from './schemas/specialty.schema';
import { SpecialtyQueryParameter } from './query-parameter/specialty-query-parameter';
import { SpecialtyQueryParameterDTO } from './dto/specialty-query-parameter.dto';
import { SpecialtyDTO } from './dto/specialty.dto';
import { Pagination } from '../../src/common/pagination/pagination';
import { IdParameterDTO } from '../../src/common/dto/id-parameter.dto';

@ApiExtraModels(Specialty)
@ApiBearerAuth()
@ApiTags('Specialty')
@Controller({ path: 'specialty', version: '1' })
export class SpecialtyController {
    constructor(private readonly service: SpecialtyService) { }

    @Get()
    @ApiOperation({ summary: 'Read many specialtys' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:specialty')
    async index(@Query() queryParameters: SpecialtyQueryParameterDTO) {
        const queryFilter = new SpecialtyQueryParameter(queryParameters);
        
        const result = await this.service.findAll(queryFilter);
        if (queryFilter.hasPaginationMeta()) {
            return result as Pagination;
        }

        return (result as Specialty[]).map<SpecialtyDTO>(SpecialtyDTO.mutation);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Read single specialty' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:specialty')
    async find(@Param() { id }: IdParameterDTO) {
        const specialty = await this.service.findOne(id);

        return SpecialtyDTO.mutation(specialty);
    }

    @Post()
    @ApiOperation({ summary: 'Create specialty' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('create:specialty')
    async create(@Body() createSpecialtyDto: CreateSpecialtyDTO) {
        const specialty = await this.service.create(createSpecialtyDto);

        return SpecialtyDTO.mutation(specialty);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update specialty' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('update:specialty')
    async update(@Param() { id }: IdParameterDTO, @Body() updateSpecialtyDTO: UpdateSpecialtyDTO) {
        const specialty = await this.service.update(id, updateSpecialtyDTO);

        return SpecialtyDTO.mutation(specialty);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete specialty' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:specialty')
    async delete(@Param() { id }: IdParameterDTO) {
        const specialty = await this.service.delete(id);

        return SpecialtyDTO.mutation(specialty);
    }
}
