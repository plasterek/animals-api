import { Injectable } from '@nestjs/common';
import { EAnimalTypes } from './file-operations/enums/animal-types.enum';
import { v4 as newId } from 'uuid';
import { IAnimal } from './models/animal.interface';
import { AnimalServiceException } from './exceptions/animal-service.exception';

@Injectable()
export class AnimalService {
  public createAnimal(name: string, type: EAnimalTypes): IAnimal {
    try {
      if (!name || !type || name.length < 1 || type.length < 1) {
        throw new Error('You need to provide proper animal name and type');
      }
      const id: string = newId();
      const animal: IAnimal = new IAnimal(name, type, id);
      return animal;
    } catch (err) {
      throw new AnimalServiceException(err);
    }
  }

  public updateAnimal(animal: IAnimal, name?: string, type?: EAnimalTypes): IAnimal {
    try {
      if (!name && !type) {
        throw new Error('You need to provide parameter you want to update');
      }
      if (name) {
        if (name.length < 1) {
          throw new Error('You need to provide proper name');
        }
        animal.name = name;
      }
      if (type) {
        if (type.length < 1) {
          throw new Error('You need to provide proper animal type');
        }
        animal.type = type;
      }
      return animal;
    } catch (err: any) {
      throw new AnimalServiceException(err);
    }
  }
}
