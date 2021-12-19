import { BaseQueryParameterDTO } from '../dto/base-query-parameter.dto';
import { Pagination } from '../pagination/pagination';
import { PaginationBuilder } from '../pagination/builder.pagination';
import { Model } from 'mongoose';

/**
 * To build the query based on the query param passed in
 */
export abstract class BaseQueryBuilder {
    allowLoadAll = true;

    constructor(private readonly qs: BaseQueryParameterDTO) {}
    
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    setMongooseQuery<T>(
    model: Model<T>,
    conditions?: object
    ) {
        const whereConditions: object = {
            $and: [{  deleted: null }],
            ...conditions,
            ...this.getWhere(),
        };

        const query = model
            .find(whereConditions)
            .skip(this.getSkip())
            .limit(this.getLimit())
            .sort(this.getOrderBy());

        return query;
    }

    getQs(): BaseQueryParameterDTO {
        return this.qs;
    }

    hasPaginationMeta(): boolean {
        return this.qs?.paginationMeta === 'true';
    }

    async getCustomPagination(
    total: number
    ): Promise<Pagination> {
        return PaginationBuilder.build(total, this.getQs());
    }

    async getPagination<T>(
    model: Model<T>,
    conditions?: object
    ): Promise<Pagination> {
        const query = this.setMongooseQuery(model, conditions);

        query.skip(0);
        query.limit(null);

        const total = await query.count();

        return PaginationBuilder.build(total, this.getQs());
    }

    protected getWhere(): object {
        const conditions = {};
        Object.keys(this.qs || {}).forEach((key: string | number) => {
            if (this[key]) {
                Object.assign(conditions, this[key](this.qs[key]));
            }
        });

        return conditions;
    }

    protected getOrderBy(): object {
        if (this.qs?.orderBy) {
            const isLatest = this.qs.orderBy.startsWith('-');
            let columnName = isLatest
                ? this.qs.orderBy.substring(1)
                : this.qs.orderBy;

            // special handilng for mongodb
            if (columnName === 'id') {
                columnName = '_id';
            }

            return {
                [columnName]: isLatest ? -1 : 1,
            };
        }
        else {
            // default will be order by ID desc
            return {
                _id: -1,
            };
        }
    }

    protected getSkip(): number {
        const recordSkip = (this.qs?.page - 1) * (this.qs?.limit || 1);

        return recordSkip < 0 ? 0 : recordSkip;
    }

    protected getLimit(): number {
        if (this.qs?.limit === 0 && this.allowLoadAll) {
            return null;
        }
        return this.qs?.limit || 30;
    }
}