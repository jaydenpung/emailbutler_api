import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { Connection } from "mongoose";


@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
    constructor(@InjectConnection() private connection: Connection) { }

    getChildFromPath(object, childPath) {
        if (!childPath) {
            return object;
        }
        if (!object) {
            return false;
        }
        let objectPointer = object
        childPath.split('.').forEach(child => {
            if (Object.keys(objectPointer).includes(child)) {
                objectPointer = objectPointer[child]
            }
            else {
                return false;
            }
        })
        return objectPointer;
    }

    async validate(value: any, args: ValidationArguments ) {
        const [schemaName, childPath] = args.constraints;
        const actualValue = this.getChildFromPath(value, childPath);
        if (actualValue === false) { //skip this validation if does not exist
            return true;
        }
        const propertyName = args.property + (childPath? `.${childPath}` : '');
        const result = await this.connection.model(schemaName).findOne({
            [propertyName]: actualValue,
            //deletedAt: null
        });

        return result === null;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property}${args.constraints[1]? "." + args.constraints[1] : ""} is not unique!`;
    }
}

export function Unique(schemaName: string, childPath?: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [schemaName, childPath],
            validator: UniqueConstraint
        });
    };
}