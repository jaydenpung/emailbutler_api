
import { BaseQueryParameterDTO } from '../dto/base-query-parameter.dto';
import { Pagination } from './pagination';

export class PaginationBuilder {
    static build(
    totalRecords: number,
    queryParam: BaseQueryParameterDTO,
    ): Pagination {
        return {
            limit: queryParam.limit,
            current: queryParam.page,
            totalItems: totalRecords,
            totalPages: Math.ceil(totalRecords / queryParam.limit),
        };
    }
}
