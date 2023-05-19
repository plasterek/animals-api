import { EAnimalTypes } from '../../file-operations/enums/animal-types.enum';

export class IAnimal {
  constructor(readonly name: string, readonly type: EAnimalTypes, readonly id: string) {}
}
