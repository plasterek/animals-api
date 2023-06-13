import { IsNotEmpty, MinLength } from 'class-validator';

export class AnimalName {
  @IsNotEmpty({ message: 'Animal name cannot be empty!' })
  @MinLength(1, { message: 'Animal name cannot be empty!' })
  name: string;
}
