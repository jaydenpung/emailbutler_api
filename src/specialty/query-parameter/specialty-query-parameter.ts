import { BaseQueryBuilder } from "../../../src/common/query-builder/builder.query-builder";

export class SpecialtyQueryParameter extends BaseQueryBuilder {
    name(value: string): object {
        return {
            $text: { $search: value },
        }
    }
}