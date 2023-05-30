import { Body, Controller, Get, Post, Param, BadRequestException, Put, ParseArrayPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { FileOperationsService } from './animal/file-operations/file-operations.service';
import { AnimalDTO } from './animal/file-operations/dtos/animal.dto';
import { IAnimal } from './animal/models/animal.interface';
import { EAnimalTypes } from './animal/file-operations/enums/animal-types.enum';
import { AnimalService } from './animal/animal.service';
import { AnimalTypeValidationPipe } from './animal/validation/animal-type-validation.pipe';

@Controller('animals')
export class AppController {
  constructor(private readonly appService: AppService, private readonly fileOperations: FileOperationsService, private readonly animalService: AnimalService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('all')
  async getAllAnimals(): Promise<IAnimal[]> {
    try {
      return await this.fileOperations.readAllFiles();
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('animal/:id')
  async getOneAnimal(@Param('id') id: string): Promise<IAnimal> {
    try {
      return await this.fileOperations.readSingleFile(id);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('animal/:id')
  async updateAnimal(@Param('id') id: string, @Body() animalDTO: AnimalDTO): Promise<IAnimal> {
    try {
      const animalFromFile: IAnimal = await this.fileOperations.readSingleFile(id);
      const updatedAnimal: IAnimal = this.animalService.updateAnimal(animalFromFile, animalDTO.name, animalDTO.type);
      return await this.fileOperations.writeSingleFile(updatedAnimal);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('add')
  async addOneAnimal(@Body() animalDTO: AnimalDTO): Promise<IAnimal> {
    try {
      const animalToWrite: IAnimal = this.animalService.createAnimal(animalDTO.name, animalDTO.type);
      return await this.fileOperations.writeSingleFile(animalToWrite);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('add/animals')
  async addAllAnimals(@Body(new ParseArrayPipe({ items: AnimalDTO })) animalsArray: AnimalDTO[]): Promise<IAnimal[]> {
    try {
      if (animalsArray.length < 1) {
        throw new Error('You need to provide proper animals array');
      }
      return this.fileOperations.writeAllFiles(animalsArray);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('add/animals/:type')
  async addAnimalsWithType(@Param('type', AnimalTypeValidationPipe) EAnimalTypes: EAnimalTypes, @Body(new ParseArrayPipe()) arrayOfNames: { name: string }[]): Promise<IAnimal[]> {
    try {
      const resultArray: IAnimal[] = [];
      if (arrayOfNames.length < 1) {
        throw new Error('You need to provide proper names array!');
      }
      for (const animal of arrayOfNames) {
        if (!animal.name || animal.name.length < 1) {
          throw new Error('You need to provide proper animal name!');
        }
        const animalToWrite: IAnimal = this.animalService.createAnimal(animal.name, EAnimalTypes);
        await this.fileOperations.writeSingleFile(animalToWrite);
        resultArray.push(animalToWrite);
      }
      return resultArray;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
