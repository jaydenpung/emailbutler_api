import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";


@ValidatorConstraint({ async: true })
export class S3PathValidConstraint implements ValidatorConstraintInterface {

    validS3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/.*`;

    async validate(value: any ) {
        return value.match(new RegExp(`^${this.validS3Url}`, 'i'));
    }

    defaultMessage() {
        return `Invalid S3 url, must match with ${this.validS3Url}`;
    }
}

export function S3PathValid(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: S3PathValidConstraint
        });
    };
}