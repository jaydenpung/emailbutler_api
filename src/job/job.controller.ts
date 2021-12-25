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
import { AuthUser } from '../../src/common/decorator/auth-user.decorator';
import { AuthUserDTO } from '../../src/common/dto/auth-user.dto';
import { JobStatusDTO } from './dto/job-status.dto';
import { JobStatus } from '../../src/common/enum/job-status.enum';

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
    async run(@AuthUser() authUser: AuthUserDTO, @Param() { id }: IdParameterDTO) {
        const job = await this.service.run(authUser, id);

        return JobDTO.mutation(job);
    }

    @Post('run')
    @ApiOperation({ summary: 'Run job without creating' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async runSingle(@AuthUser() authUser: AuthUserDTO, @Body() runJobDTO: RunJobDTO) {
        const job = await this.service.runSingle(authUser, runJobDTO);

        return job;
    }

    @Post('preview/:id')
    @ApiOperation({ summary: 'Run job preview - get email subjects only' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async preview(@AuthUser() authUser: AuthUserDTO, @Param() { id }: IdParameterDTO) {
        const jobPreview = await this.service.preview(authUser, id);

        return JobPreviewDTO.mutation(jobPreview);
    }

    @Get('check/:id')
    @ApiOperation({ summary: 'Check job status' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:job')
    async check(@AuthUser() authUser: AuthUserDTO, @Param() { id }: IdParameterDTO) {
        const job = await this.service.findOne(authUser, id);

        return JobStatusDTO.mutation(job);
    }

    @Get('checkLongPolling/:id')
    @ApiOperation({ summary: 'Check job status via long polling' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:job')
    async checkLongPolling(@AuthUser() authUser: AuthUserDTO, @Param() { id }: IdParameterDTO) {
        let job;
        while (true) {
            job = await this.service.findOne(authUser, id);

            if (job.status === JobStatus.NORMAL) {
                break;
            }
        }

        return JobStatusDTO.mutation(job);
    }

    /*** CRUD ***/
    @Get()
    @ApiOperation({ summary: 'Read many jobs' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('list:job')
    async index(@AuthUser() authUser: AuthUserDTO, @Query() queryParameters: JobQueryParameterDTO) {
        const queryFilter = new JobQueryParameter(queryParameters);

        let result = await this.service.findAll(authUser, queryFilter);
        
        if (queryFilter.hasPaginationMeta()) {
            const paginationData = result as Pagination;

            queryFilter.getQs().paginationMeta = "false";
            result = await this.service.findAll(authUser, queryFilter);
            
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
    async create(@AuthUser() authUser: AuthUserDTO, @Body() createJobDto: CreateJobDTO) {
        const job = await this.service.create(authUser, createJobDto);

        return JobDTO.mutation(job);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Read single job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('read:job')
    async find(@AuthUser() authUser: AuthUserDTO, @Param() { id }: IdParameterDTO) {
        const job = await this.service.findOne(authUser, id);

        return JobDTO.mutation(job);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('update:job')
    async update(@AuthUser() authUser: AuthUserDTO, @Param() { id }: IdParameterDTO, @Body() updateJobDTO: UpdateJobDTO) {
        const job = await this.service.update(authUser, id, updateJobDTO);

        return JobDTO.mutation(job);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete job' })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:job')
    async delete(@AuthUser() authUser: AuthUserDTO, @Param() { id }: IdParameterDTO) {
        const job = await this.service.delete(authUser, id);

        return JobDTO.mutation(job);
    }
}
