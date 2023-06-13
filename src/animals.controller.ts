import { Body, Controller, Get, Post, Param, Put, ParseArrayPipe, UseFilters, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FileOperationsService } from './animal/file-operations/file-operations.service';
import { AnimalDTO } from './animal/file-operations/dtos/animal.dto';
import { IAnimal } from './animal/models/animal.interface';
import { EAnimalTypes } from './animal/file-operations/enums/animal-types.enum';
import { AnimalService } from './animal/animal.service';
import { AnimalTypeValidationPipe } from './animal/validation/animal-type-validation.pipe';
import { Response, response } from 'express';
import { AnimalIdDTO } from './animal/dto/animal-id.dto';
import { AnimalNameDTO } from './animal/dto/animal-name.dto';
import { FileOperationsExceptionFilter } from './animal/file-operations/exceptions/file-operations-exception-filter.exeption';

@Controller('animals')
@UseFilters(FileOperationsExceptionFilter)
export class AnimalsController {
  constructor(private readonly appService: AppService, private readonly fileOperations: FileOperationsService, private readonly animalService: AnimalService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('all')
  async getAllAnimals(): Promise<IAnimal[]> {
    return await this.fileOperations.readAllFiles();
  }

  @Get('animal/:id')
  async getOneAnimal(@Param() animalIdDto: AnimalIdDTO): Promise<IAnimal> {
    const animalID: string = animalIdDto.id;
    return await this.fileOperations.readSingleFile(animalID);
  }

  @Put('animal/:id')
  async updateAnimal(@Param() animalIdDto: AnimalIdDTO, @Body() animalDTO: AnimalDTO, @Res() response: Response) {
    const animalID: string = animalIdDto.id;
    const animalFromFile: IAnimal = await this.fileOperations.readSingleFile(animalID);
    const updatedAnimal: IAnimal = this.animalService.updateAnimal(animalFromFile, animalDTO.name, animalDTO.type);
    this.fileOperations.writeSingleFile(updatedAnimal);
    response.status(202).send({ status: 202, message: 'Accepted' });
  }

  @Post('add')
  async addOneAnimal(@Body() animalDTO: AnimalDTO, @Res() response: Response): Promise<void> {
    const animalToWrite: IAnimal = this.animalService.createAnimal(animalDTO.name, animalDTO.type);
    this.fileOperations.writeSingleFile(animalToWrite);
    response.status(202).send({ status: 202, message: 'Accepted' });
  }

  @Post('add/animals')
  async addAllAnimals(@Body(new ParseArrayPipe({ items: AnimalDTO })) animalDtoArray: AnimalDTO[], @Res() response: Response): Promise<void> {
    this.fileOperations.writeAllFiles(animalDtoArray);
    response.status(202).send({ status: 202, message: 'Accepted' });
  }

  @Post('add/animals/:type')
  async addAnimalsWithType(
    @Param('type', AnimalTypeValidationPipe) eAnimalTypes: EAnimalTypes,
    @Body(new ParseArrayPipe({ items: AnimalNameDTO })) arrayOfNames: AnimalNameDTO[],
    @Res() response: Response,
  ): Promise<void> {
    console.log(arrayOfNames);

    for (const animal of arrayOfNames) {
      const animalToWrite: IAnimal = this.animalService.createAnimal(animal.name, eAnimalTypes);
      this.fileOperations.writeSingleFile(animalToWrite);
    }
    response.status(202).send({ status: 202, message: 'Accepted' });
  }
}
