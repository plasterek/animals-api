import { IsNotEmpty, MinLength } from 'class-validator';

export class AnimalNameDTO {
  @IsNotEmpty({ message: 'Animal name cannot be empty!' })
  @MinLength(1, { message: 'Animal name cannot be empty!' })
  name: string;
}
