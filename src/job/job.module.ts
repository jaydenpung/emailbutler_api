import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';

@Module({
    providers: [JobService],
    controllers: [JobController],
    imports: [
        MongooseModule.forFeature([
            { name: Job.name, schema: JobSchema }
        ]),
    ],
})
export class JobModule { }
