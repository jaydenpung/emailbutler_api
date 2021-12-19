import {
    Controller,
    UseGuards,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileService } from './file.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../permissions.guard';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CreateFileDTO } from './dto/create-file.dto';
import { DeleteFileDTO } from './dto/delete-file.dto';

@ApiBearerAuth()
@ApiTags('File')
@Controller({ path: 'file', version: '1' })
export class FileController {
    constructor(private readonly service: FileService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                folder: { type: 'string' },
                file: {
                    type: 'file',
                    format: 'binary',
                },
            },
        }
    })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('create:file')
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() createFileDTO: CreateFileDTO) {
        return await this.service.uploadFile(file, createFileDTO);
    }

    @Delete('')
    @ApiOperation({ summary: 'Delete file' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                path: { type: 'string' }
            },
        }
    })
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    //@Permissions('delete:file')
    async deleteFile(@Body() deleteFileDTO: DeleteFileDTO) {
        return await this.service.deleteFile(deleteFileDTO);
    }
}
