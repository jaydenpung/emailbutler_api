import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { CreateFileDTO } from './dto/create-file.dto';
import { FileDTO } from './dto/file.dto';
import { CustomGeneralException } from '../../src/common/exception/custom-general.exception';
import { DeleteFileDTO } from './dto/delete-file.dto';
import { File } from './schemas/file.schema';
import { ValidationException } from '../../src/common/exception/validation.exception';

@Injectable()
export class FileService {
    constructor(@InjectModel(File.name) private readonly model: Model<File>) { }

    async uploadFile(multerFile: Express.Multer.File, createFileDTO: CreateFileDTO): Promise<FileDTO> {

        if (!multerFile) {
            throw new ValidationException("Missing File");
        }

        let folderName = createFileDTO.folder;
        if (!folderName.match(/\/$/)) {
            folderName += "/"
        }

        const imageExtension = /\.(jpeg|jpg|png|gif|)$/;
        const pdfExtension = /\.pdf$/;
        let mimeType = multerFile.mimetype;
        if (!mimeType) {
            let matchedResult = multerFile.originalname.match(imageExtension)
            if (multerFile.originalname.match(imageExtension)) {
                const extension = matchedResult[0].replace('.', '');
                mimeType = 'image/' + extension;
            }
            matchedResult = multerFile.originalname.match(pdfExtension)
            if (multerFile.originalname.match(pdfExtension)) {
                const extension = matchedResult[0].replace('.', '');
                mimeType = 'application/' + extension;
            }
        }

        const configuration = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: multerFile.buffer,
            Key: `${folderName}${uuid()}-${multerFile.originalname}`,
            ContentType: mimeType
        }

        const uploadResult = await new S3().upload(configuration).promise().catch(ex => {
            throw new CustomGeneralException(`S3 Upload Error: ${ex}`)
        })
        const fileDTO = new FileDTO();
        fileDTO.path = uploadResult['Location'];
        return fileDTO;
    }

    async deleteFile(deleteFileDTO: DeleteFileDTO) {
        const validS3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        const key = deleteFileDTO.path.replace(validS3Url, '');
        await new S3().deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        }).promise().catch(ex => {
            throw new CustomGeneralException(`S3 Upload Error: ${ex}`)
        })

        return null;
    }
}
