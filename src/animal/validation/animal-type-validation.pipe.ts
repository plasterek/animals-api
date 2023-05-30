import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { EAnimalTypes } from '../file-operations/enums/animal-types.enum';

@Injectable()
export class AnimalTypeValidationPipe implements PipeTransform {
  transform(value: string): string {
    value = value.toLowerCase();
    if (!Object.values(EAnimalTypes).includes(value as EAnimalTypes)) {
      throw new BadRequestException(`Invalid animal type. Allowed values are: ${Object.values(EAnimalTypes).join(', ')}`);
    }
    return value;
  }
}
