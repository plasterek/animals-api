import { EAnimalTypes } from '../enums/animal-types.enum';

export class AnimalDTO {
  constructor(public name: string, public type: EAnimalTypes) {}
}
