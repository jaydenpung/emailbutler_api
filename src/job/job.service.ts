import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateJobDTO } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { JobQueryParameter } from './query-parameter/job-query-parameter';
import { Pagination } from '../common/pagination/pagination';
import { NotFoundException } from '../common/exception/not-found.exception';
import { google } from 'googleapis';
import { JobResultDTO } from './dto/job-result.dto';
import { FileDTO } from './dto/file.dto';
import { JobPreviewDTO } from './dto/job-preview.dto';
import { EmailDTO } from './dto/email.dto';
import * as stream from 'stream';
import { JobDTO } from './dto/job.dto';
import { RunJobDTO } from './dto/run-job.dto';

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

    async findOwnAll(authUserId: string, queryFilter: JobQueryParameter): Promise<Job[] | Pagination> {
        if (queryFilter.hasPaginationMeta()) {
            return queryFilter.getPagination(this.model, { deletedAt: null, authUserId: authUserId });
        }

        return queryFilter.setMongooseQuery(this.model, { deletedAt: null, authUserId: authUserId });
    }

    async findOne(id: Types.ObjectId): Promise<Job> {
        const job = await this.model.findOne({ _id: id, deletedAt: null});

        if (!job) {
            throw new NotFoundException();
        }

        return job;
    }

    async create(authUserId: string, createJobDto: CreateJobDTO): Promise<Job> {
        return this.model.create({
            ...createJobDto,
            authUserId: authUserId,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    async update(id: Types.ObjectId, updateJobDTO: UpdateJobDTO): Promise<Job> {
        const job = await this.model.findOne({ _id: id, deletedAt: null});

        if (!job) {
            throw new NotFoundException();
        }

        job.name = updateJobDTO.name || job.name;
        job.folderId = updateJobDTO.folderId || job.folderId;
        job.folderName = updateJobDTO.folderName || job.folderName;
        job.storagePath = updateJobDTO.storagePath || job.storagePath;
        job.mailQuery = updateJobDTO.mailQuery || job.mailQuery;
        job.recurring = updateJobDTO.recurring || job.recurring;
        job.jobResults = updateJobDTO.jobResults || job.jobResults;

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
    
    async run(userDetail: any, id: Types.ObjectId): Promise<Job> {
        const job = await this.model.findOne({ _id: id, authUserId: userDetail.user_id, deletedAt: null});

        if (!job) {
            throw new NotFoundException();
        }
        job.lastRunAt = new Date();

        const jobDTO = await this.runJob(userDetail.identities[0].refresh_token, JobDTO.mutation(job));
        job.jobResults = jobDTO.jobResults;
        job.folderId = jobDTO.folderId;
        job.storagePath = jobDTO.storagePath;

        return job.save();
    }

    async runSingle(userDetail: any, runJobDTO: RunJobDTO): Promise<JobDTO> {
        const jobDTO = new JobDTO();
        jobDTO.folderName = runJobDTO.folderName;
        jobDTO.mailQuery = runJobDTO.mailQuery;
        return await this.runJob(userDetail.identities[0].refresh_token, jobDTO);
    }

    async preview(userDetail: any, id: Types.ObjectId): Promise<JobPreviewDTO> {
        const job = await this.model.findOne({ _id: id, authUserId: userDetail.user_id, deletedAt: null});

        if (!job) {
            throw new NotFoundException();
        }

        const jobPreview = new JobPreviewDTO();
        jobPreview.emails = [];

        // intialize auth client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOG_CLIENT_ID,
            process.env.GOOG_CLIENT_SECRET,
            process.env.GOOG_REDIRECT_URI
        );
        oauth2Client.setCredentials({ refresh_token: userDetail.identities[0].refresh_token });
        const defaultConfig = {
            auth: oauth2Client,
            userId: 'me'
        }

        // run job
        const gmail = google.gmail('v1').users.messages;
        const searchResults = await gmail.list({
            ...defaultConfig,
            q: job.mailQuery
        })

        if (searchResults.data.resultSizeEstimate === 0) {
            return jobPreview;
        }

        const searchedMails = searchResults.data.messages;
        // go through each mail
        for (const searchedMail of searchedMails) {

            const emailDTO = new EmailDTO();

            const mail = await gmail.get({
                ...defaultConfig,
                id: searchedMail.id
            });

            emailDTO.snippet = mail.data.snippet;

            // look for subject and date
            for (const header of mail.data.payload.headers) {
                if (header.name === 'Subject') {
                    emailDTO.subject = header.value;
                }
                else if (header.name == 'Date') {
                    emailDTO.date = new Date(header.value);
                }
            }

            // look for attachments
            for (const part of mail.data.payload.parts) {
                if (part.filename !== '') {
                    emailDTO.hasAttachment = true;
                }
            }
            jobPreview.emails.push(emailDTO);
        }

        return jobPreview;
    }

    async runJob(googleRefreshToken: string, job: JobDTO): Promise<JobDTO> {
        job.lastRunAt = new Date();

        //intialize auth client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOG_CLIENT_ID,
            process.env.GOOG_CLIENT_SECRET,
            process.env.GOOG_REDIRECT_URI
        );
        oauth2Client.setCredentials({ refresh_token: googleRefreshToken });
        const defaultConfig = {
            auth: oauth2Client,
            userId: 'me'
        }

        //run job
        const gdrive = google.drive('v3');
        const gmail = google.gmail('v1').users.messages;
        const searchResults = await gmail.list({
            ...defaultConfig,
            q: job.mailQuery
        })

        if (searchResults.data.resultSizeEstimate === 0) {
            return job;
        }

        let createFolder = false;
        if (!job.storagePath || !job.folderId) {
            createFolder = true;
        }
        else {
            const foundFolder = await gdrive.files.get({
                ...defaultConfig,
                fileId: job.folderId,
                fields: 'id, trashed'
            })

            if (!foundFolder.data.id || foundFolder.data.trashed) {
                createFolder = true;
            }
        }

        if (createFolder) {            
            //create gdrive folder for job
            const folderCreated = await gdrive.files.create({
                ...defaultConfig,
                requestBody: {
                    name : job.folderName,
                    mimeType : 'application/vnd.google-apps.folder'
                },
                fields: 'id'
            })
            job.folderId = folderCreated.data.id;
            job.storagePath = `https://drive.google.com/drive/folders/${folderCreated.data.id}`;
        }
        

        const jobResults = [];
        const searchedMails = searchResults.data.messages;
        // go through each mail
        for (const searchedMail of searchedMails) {
            const jobResult = JobResultDTO.mutation(new JobResultDTO());

            const mail = await gmail.get({
                ...defaultConfig,
                id: searchedMail.id
            });

            //look for subject
            for (const header of mail.data.payload.headers) {
                if (header.name === 'Subject') {
                    jobResult.emailTitle = header.value;
                }
                else if (header.name == 'Date') {
                    jobResult.emailDate = new Date(header.value);
                }
            }

            // look for attachments in email 
            for (const part of mail.data.payload.parts) {
                if (part.filename !== '') {

                    // get attachment itself in email
                    const attachment = await gmail.attachments.get({
                        ...defaultConfig,
                        id: part.body.attachmentId,
                        messageId: searchedMail.id
                    })

                    const bufferStream = new stream.PassThrough();
                    bufferStream.end(Buffer.from(attachment.data.data, 'base64'));

                    // save attachment to gdrive
                    const uploadResults = await gdrive.files.create({
                        ...defaultConfig,
                        requestBody: {
                            name: part.filename,
                            mimeType: part.mimeType,
                            parents: [ job.folderId ]
                        },
                        media: {
                            mimeType: part.mimeType,
                            body: bufferStream
                        },
                        fields: 'id'
                    })

                    // append gdrive file info to jobResult
                    const file = new FileDTO();
                    file.fileName = part.filename;
                    file.storagePath = `https://drive.google.com/open?id=${uploadResults.data.id}`;
                    jobResult.files.push(file);
                }
            }

            jobResults.push(jobResult);
        }

        // collect all jobResults
        job.jobResults = job.jobResults || [];
        job.jobResults = job.jobResults.concat(jobResults);

        return job;
    }
}
