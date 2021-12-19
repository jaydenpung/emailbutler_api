import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseQueryParameterDTO {
    @ApiProperty({ required: false })
    page: number = 1;

    @ApiProperty({ required: false })
    limit: number = 30;

    @ApiProperty({ required: false })
    orderBy: string = '-id';

    @ApiProperty({ required: false })
    paginationMeta: string;
}
