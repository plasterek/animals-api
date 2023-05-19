import { Injectable } from '@nestjs/common';
import { EAnimalTypes } from 'src/file-operations/enums/animal-types.enum';
import { v4 as newId } from 'uuid';
import { IAnimal } from './models/animal.interface';

@Injectable()
export class AnimalService {
  createAnimal(name: string, type: EAnimalTypes): IAnimal {
    const id: string = newId();
    const animal: IAnimal = {
      id: id,
      name: name,
      type: type,
    };
    return animal;
  }

  public animalTypeValidation(type: string) {
    if (Object.values(EAnimalTypes).includes(type as EAnimalTypes)) {
      return true;
    }
    return false;
  }
}
