import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserQueryParameter } from './query-parameter/user-query-parameter';
import axios from 'axios';
import { AuthenticationClient } from 'auth0';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly model: Model<UserDocument>
    ) { }

    async findAll(queryFilter: UserQueryParameter): Promise<any> {
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

        await axios.request({
            method: 'GET',
            url: `${process.env.AUTH0_ISSUER_URL}${process.env.AUTH_USER_ENDPOINT}`,
            params: params,
            headers: { authorization: `Bearer ${await this.getManagementAccessToken()}` }
        }).then(res => {
            userList = res.data;
        }).catch(err => {
            const error = new Error(err.message);
            error['type'] = 'API call to auth0 Fail';
            throw error;
        })

        if (queryFilter.hasPaginationMeta()) {
            return queryFilter.getCustomPagination(userList.total)
        }

        return userList;
    }

    async findOne(userDetail: any): Promise<any> {
        let userData = null;
        await axios.get(`${process.env.AUTH0_ISSUER_URL}${process.env.AUTH_USER_ENDPOINT}/${userDetail.user_id}`, {
            headers: { authorization: `Bearer ${await this.getManagementAccessToken()}` }
        }).then(res => {
            userData = res.data;
        })
        return userData;
    }

    async update(auth0UserData: any): Promise<any> {
        const user = await this.model.updateOne(
            { authId: auth0UserData.user_id, deletedAt: null },
            { email: auth0UserData.email, authId: auth0UserData.user_id, refreshToken: auth0UserData.identities[0].refresh_token, updatedAt: new Date() },
            { upsert: true }
        );

        return user;
    }

    getManagementAccessToken() {
        const auth0 = new AuthenticationClient({
            domain: `${process.env.AUTH0_ACCOUNT}.auth0.com`,
            clientId: `${process.env.AUTH0_M2M_CLIENT_ID}`,
            clientSecret: `${process.env.AUTH0_M2M_CLIENT_SECRET}`
        })
        return new Promise((res, rej) => {
            auth0.clientCredentialsGrant(
                {
                    audience: `${process.env.AUTH0_ISSUER_URL}api/v2/`
                },
                function (err, response) {
                    res(response.access_token);
                }
            );
        });
    }
}
