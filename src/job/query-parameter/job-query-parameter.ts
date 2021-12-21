import { BaseQueryBuilder } from "../../common/query-builder/builder.query-builder";

export class JobQueryParameter extends BaseQueryBuilder {
    name(value: string): object {
        return {
            $text: { $search: value },
        }
    }

    recurring(value: boolean): object {
        return  {
            recurring: value
        }
    }
}