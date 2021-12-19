import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSpecialtyDTO } from './dto/create-specialty.dto';
import { UpdateSpecialtyDTO } from './dto/update-specialty.dto';
import { Specialty, SpecialtyDocument } from './schemas/specialty.schema';
import { SpecialtyQueryParameter } from './query-parameter/specialty-query-parameter';
import { Pagination } from '../../src/common/pagination/pagination';
import { NotFoundException } from '../../src/common/exception/not-found.exception';

@Injectable()
export class SpecialtyService {
    constructor(
        @InjectModel(Specialty.name) private readonly model: Model<SpecialtyDocument>
    ) { }

    async findAll(queryFilter: SpecialtyQueryParameter): Promise<Specialty[] | Pagination> {
        if (queryFilter.hasPaginationMeta()) {
            return queryFilter.getPagination(this.model, { deletedAt: null });
        }

        return queryFilter.setMongooseQuery(this.model, { deletedAt: null });
    }

    async findOne(id: Types.ObjectId): Promise<Specialty> {
        const specialty = await this.model.findOne({ _id: id, deletedAt: null});

        if (!specialty) {
            throw new NotFoundException();
        }

        return specialty;
    }

    async create(createSpecialtyDto: CreateSpecialtyDTO): Promise<Specialty> {
        return this.model.create({
            ...createSpecialtyDto,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    async update(id: Types.ObjectId, updateSpecialtyDTO: UpdateSpecialtyDTO): Promise<Specialty> {
        const specialty = await this.model.findOne({ _id: id, deletedAt: null});

        if (!specialty) {
            throw new NotFoundException();
        }

        specialty.name = updateSpecialtyDTO.name;
        specialty.updatedAt = new Date();
        return specialty.save();
    }
    
    async delete(id: Types.ObjectId): Promise<Specialty> {
        const specialty = await this.model.findOne({ _id: id, deletedAt: null});

        if (!specialty) {
            throw new NotFoundException();
        }
        specialty.deletedAt = new Date();
        return specialty.save();
    }
}
