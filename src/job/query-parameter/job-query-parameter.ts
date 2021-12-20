import { BaseQueryBuilder } from "../../common/query-builder/builder.query-builder";

export class JobQueryParameter extends BaseQueryBuilder {
    name(value: string): object {
        return {
            $text: { $search: value },
        }
    }
}