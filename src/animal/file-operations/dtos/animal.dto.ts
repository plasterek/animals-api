import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { EAnimalTypes } from '../enums/animal-types.enum';

export class AnimalDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly type: EAnimalTypes;
}
