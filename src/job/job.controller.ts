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
import { JobPreviewDTO } from './dto/job-preview.dto';
import { RunJobDTO } from './dto/run-job.dto';
import { TokenUserDTO } from '../../src/common/dto/token-user.dto';

@ApiExtraModels(Job)
@ApiBearerAuth()
@ApiTags('Job')
@Controller({ path: 'job', version: '1' })
export class JobController {
    constructor(private readonly service: JobService) { }

    @Post('run/:id')
    @ApiOperation({ summary: 'Run job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async run(@Req() request, @Param() { id }: IdParameterDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const job = await this.service.run(userDetail, id);

        return JobDTO.mutation(job);
    }

    @Post('run')
    @ApiOperation({ summary: 'Run job without creating' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async runSingle(@Req() request, @Body() runJobDTO: RunJobDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const job = await this.service.runSingle(userDetail, runJobDTO);

        return job;
    }

    @Post('preview/:id')
    @ApiOperation({ summary: 'Run job preview - get email subjects only' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async preview(@Req() request, @Param() { id }: IdParameterDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const jobPreview = await this.service.preview(userDetail, id);

        return JobPreviewDTO.mutation(jobPreview);
    }

    /*** CRUD ***/
    @Get()
    @ApiOperation({ summary: 'Read many jobs' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:job')
    async index(@Req() request, @Query() queryParameters: JobQueryParameterDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const queryFilter = new JobQueryParameter(queryParameters);
        
        let result = await this.service.findAll(userDetail, queryFilter);
        
        if (queryFilter.hasPaginationMeta()) {
            const paginationData = result as Pagination;

            queryFilter.getQs().paginationMeta = "false";
            result = await this.service.findAll(userDetail, queryFilter);
            
            return {
                results: (result as Job[]).map<JobDTO>(JobDTO.mutation),
                pagination: paginationData
            }
        }

        return (result as Job[]).map<JobDTO>(JobDTO.mutation);
    }

    @Post()
    @ApiOperation({ summary: 'Create job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('create:job')
    async create(@Req() request, @Body() createJobDto: CreateJobDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const job = await this.service.create(userDetail, createJobDto);

        return JobDTO.mutation(job);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Read single job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:job')
    async find(@Req() request, @Param() { id }: IdParameterDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const job = await this.service.findOne(userDetail, id);

        return JobDTO.mutation(job);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('update:job')
    async update(@Req() request, @Param() { id }: IdParameterDTO, @Body() updateJobDTO: UpdateJobDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const job = await this.service.update(userDetail, id, updateJobDTO);

        return JobDTO.mutation(job);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async delete(@Req() request, @Param() { id }: IdParameterDTO) {
        const userDetail = TokenUserDTO.mutation(request.user[`${process.env.AUTH0_AUDIENCE}/user`]);
        const job = await this.service.delete(userDetail, id);

        return JobDTO.mutation(job);
    }
}
