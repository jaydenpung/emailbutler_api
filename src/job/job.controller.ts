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
import { CreateJobDTO } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job.dto';
import { JobService } from './job.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../permissions.guard';
import { Job } from './schemas/job.schema';
import { JobQueryParameter } from './query-parameter/job-query-parameter';
import { JobQueryParameterDTO } from './dto/job-query-parameter.dto';
import { JobDTO } from './dto/job.dto';
import { Pagination } from '../common/pagination/pagination';
import { IdParameterDTO } from '../common/dto/id-parameter.dto';
import { request } from 'http';

@ApiExtraModels(Job)
@ApiBearerAuth()
@ApiTags('Job')
@Controller({ path: 'job', version: '1' })
export class JobController {
    constructor(private readonly service: JobService) { }

    @Get()
    @ApiOperation({ summary: 'Read many jobs' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:job')
    async index(@Query() queryParameters: JobQueryParameterDTO) {
        const queryFilter = new JobQueryParameter(queryParameters);
        
        const result = await this.service.findAll(queryFilter);
        if (queryFilter.hasPaginationMeta()) {
            return result as Pagination;
        }

        return (result as Job[]).map<JobDTO>(JobDTO.mutation);
    }

    @Get('me')
    @ApiOperation({ summary: 'Read many jobs' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:job')
    async listOwnJob(@Req() request, @Query() queryParameters: JobQueryParameterDTO) {
        const queryFilter = new JobQueryParameter(queryParameters);
        const userDetail = request.user[`${process.env.AUTH0_AUDIENCE}userDetail`]
        
        const result = await this.service.findOwnAll(userDetail.user_id, queryFilter);
        if (queryFilter.hasPaginationMeta()) {
            return result as Pagination;
        }

        return (result as Job[]).map<JobDTO>(JobDTO.mutation);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Read single job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:job')
    async find(@Param() { id }: IdParameterDTO) {
        const job = await this.service.findOne(id);

        return JobDTO.mutation(job);
    }

    @Post()
    @ApiOperation({ summary: 'Create job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('create:job')
    async create(@Req() request, @Body() createJobDto: CreateJobDTO) {
        const userDetail = request.user[`${process.env.AUTH0_AUDIENCE}userDetail`]
        const job = await this.service.create(userDetail.user_id, createJobDto);

        return JobDTO.mutation(job);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('update:job')
    async update(@Param() { id }: IdParameterDTO, @Body() updateJobDTO: UpdateJobDTO) {
        const job = await this.service.update(id, updateJobDTO);

        return JobDTO.mutation(job);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async delete(@Param() { id }: IdParameterDTO) {
        const job = await this.service.delete(id);

        return JobDTO.mutation(job);
    }

    @Post('run/:id')
    @ApiOperation({ summary: 'Run job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async run(@Req() request, @Param() { id }: IdParameterDTO) {
        const userDetail = request.user[`${process.env.AUTH0_AUDIENCE}userDetail`]
        const job = await this.service.run(userDetail, id);

        return JobDTO.mutation(job);
    }
}
