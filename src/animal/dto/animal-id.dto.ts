import { IsNotEmpty } from 'class-validator';

export class AnimalIdDTO {
  @IsNotEmpty({ message: 'You need to provide proper Animal ID' })
  id: string;
}
