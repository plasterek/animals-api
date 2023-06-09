import { EAnimalTypes } from '../file-operations/enums/animal-types.enum';

export class IAnimal {
  constructor(public name: string, public type: EAnimalTypes, public readonly id: string) {}
}
