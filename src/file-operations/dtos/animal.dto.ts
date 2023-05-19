import { EAnimalTypes } from '../enums/animal-types.enum';

export class AnimalDTO {
  constructor(readonly name: string, readonly type: EAnimalTypes) {}
}
