import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserQueryParameter } from './query-parameter/user-query-parameter';
import { ManagementClient } from 'auth0';
import { UserDTO } from './dto/user.dto';
import { Pagination } from '../../src/common/pagination/pagination';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthUserDTO } from '../../src/common/dto/auth-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly model: Model<UserDocument>
    ) { }

    async findAll(queryFilter: UserQueryParameter): Promise<User[] | Pagination> {
        if (queryFilter.hasPaginationMeta()) {
            return queryFilter.getPagination(this.model, { deletedAt: null });
        }

        return queryFilter.setMongooseQuery(this.model, { deletedAt: null });
    }

    async findOne(id: Types.ObjectId): Promise<User> {
        const user = await this.model.findOne({ _id: id, deletedAt: null});

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    async create(createUserDto: CreateUserDTO): Promise<User> {
        return this.model.create({
            ...createUserDto,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    async update(id: Types.ObjectId, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user = await this.model.findOne({ _id: id, deletedAt: null});

        if (!user) {
            throw new NotFoundException();
        }

        user.authUserId = updateUserDTO.authUserId || user.authUserId;
        user.email = updateUserDTO.email || user.email;
        user.refreshToken = updateUserDTO.refreshToken || user.refreshToken;
        user.updatedAt = new Date();

        return user.save();
    }
    
    async delete(id: Types.ObjectId): Promise<User> {
        const user = await this.model.findOne({ _id: id, deletedAt: null});

        if (!user) {
            throw new NotFoundException();
        }
        return user.delete();
    }

    async upsert(updateUserDTO: UpdateUserDTO): Promise<any> {
        return await this.model.updateOne(
            { authUserId: updateUserDTO.authUserId, deletedAt: null },
            { email: updateUserDTO.email, authUserId: updateUserDTO.authUserId, refreshToken: updateUserDTO.refreshToken, updatedAt: new Date() },
            { upsert: true }
        );
    }

    async findAllFromApi(queryFilter: UserQueryParameter): Promise<any> {
        let userList = null;
        const params = {
            search_engine: "v3"
        };

        if (queryFilter.hasPaginationMeta()) {
            params['include_totals'] = true;
        }

        const qs = queryFilter.getQs();
        let authUserSearchQuery = "";
        Object.keys(qs).forEach((key: string | number) => {
            if (key === "limit") {
                params['per_page'] = qs[key];
            }
            else if (key === "orderBy") {
                const columnName = qs[key].replace(/^\-/, '');
                const isAscending = qs[key].match(/^\-/) ? -1 : 1;
                params['sort'] = `${columnName}:${isAscending}`;
            }
            else if (key === "page") {
                params[key] = qs[key] - 1; // auth0 page is 0 based
            }
            else if (key === "paginationMeta") { 
            }
            else {
                authUserSearchQuery += `${key}:"${qs[key]}",` //exact search, replace double quote with * for wildcard
            }
        });
        if (authUserSearchQuery !== "") {
            params['q'] = authUserSearchQuery.replace(/,$/, '');
        }

        const auth0 = await this.getManagementClient()
        userList = await auth0.getUsers({
            q: params['q'],
            sort: params['sort'],
            per_page: params['per_page'],
            page: params['page'],
            include_totals: params['include_totals'],
            search_engine: params['search_engine']
        })

        if (queryFilter.hasPaginationMeta()) {
            return queryFilter.getCustomPagination(userList.total)
        }

        return userList;
    }

    async findOneFromToken(authUser: AuthUserDTO): Promise<UserDTO> {
        return UserDTO.mutation(authUser);
    }

    async findOneFromApi(authUser: AuthUserDTO): Promise<any> {
        const auth0 = await this.getManagementClient();        
        return auth0.getUser({ id: authUser.userId });
    }

    async getManagementClient(): Promise<ManagementClient> {
        return new ManagementClient({
            domain: `${process.env.AUTH0_ACCOUNT}.auth0.com`,
            clientId: `${process.env.AUTH0_M2M_CLIENT_ID}`,
            clientSecret: `${process.env.AUTH0_M2M_CLIENT_SECRET}`
        });
    }
}
