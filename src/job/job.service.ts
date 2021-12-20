import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateJobDTO } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { JobQueryParameter } from './query-parameter/job-query-parameter';
import { Pagination } from '../common/pagination/pagination';
import { NotFoundException } from '../common/exception/not-found.exception';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name) private readonly model: Model<JobDocument>
    ) { }

    async findAll(queryFilter: JobQueryParameter): Promise<Job[] | Pagination> {
        if (queryFilter.hasPaginationMeta()) {
            return queryFilter.getPagination(this.model, { deletedAt: null });
        }

        return queryFilter.setMongooseQuery(this.model, { deletedAt: null });
    }

    async findOne(id: Types.ObjectId): Promise<Job> {
        const job = await this.model.findOne({ _id: id, deletedAt: null});

        if (!job) {
            throw new NotFoundException();
        }

        return job;
    }

    async create(createJobDto: CreateJobDTO): Promise<Job> {
        return this.model.create({
            ...createJobDto,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    async update(id: Types.ObjectId, updateJobDTO: UpdateJobDTO): Promise<Job> {
        const job = await this.model.findOne({ _id: id, deletedAt: null});

        if (!job) {
            throw new NotFoundException();
        }

        job.name = updateJobDTO.name;
        job.storagePath = updateJobDTO.storagePath;
        job.mailQuery = updateJobDTO.mailQuery;
        job.recurring = updateJobDTO.recurring;
        job.jobResults = updateJobDTO.jobResults;

        job.updatedAt = new Date();
        return job.save();
    }
    
    async delete(id: Types.ObjectId): Promise<Job> {
        const job = await this.model.findOne({ _id: id, deletedAt: null});

        if (!job) {
            throw new NotFoundException();
        }
        job.deletedAt = new Date();
        return job.save();
    }
}
