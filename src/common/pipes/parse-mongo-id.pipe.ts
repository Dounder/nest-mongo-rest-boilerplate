import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string /* metadata: ArgumentMetadata */) {
    if (!isMongoId(value)) throw new BadRequestException(`${value} is not valid Mongo ID`);

    return value;
  }
}
