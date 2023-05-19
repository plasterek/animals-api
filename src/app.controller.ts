import { Body, Controller, Get, Post, Param, BadRequestException, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { FileOperationsService } from './file-operations/file-operations.service';
import { AnimalDTO } from './file-operations/dtos/animal.dto';
import { IAnimal } from './animal/models/animal.interface';
import { EAnimalTypes } from './file-operations/enums/animal-types.enum';
import { AnimalService } from './animal/animal.service';

@Controller('animals')
export class AppController {
  constructor(private readonly appService: AppService, private readonly fileOperations: FileOperationsService, private readonly animalService: AnimalService) {}
  private readonly filesDirectory: string = './animals';

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('all')
  async getAllAnimals(): Promise<AnimalDTO[]> {
    try {
      const allAnimals: AnimalDTO[] = await this.fileOperations.readAllFiles(this.filesDirectory);
      return allAnimals;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('animal/:id')
  async getOneAnimal(@Param('id') id: string): Promise<AnimalDTO> {
    try {
      const animal: AnimalDTO = await this.fileOperations.readSingleFile(`${this.filesDirectory}/${id}.json`);
      return animal;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('animal/:id')
  async updateAnimal(@Param('id') id: string, @Body() animal: AnimalDTO) {
    try {
      const animalFromFile: IAnimal = await this.fileOperations.readSingleFile(`${this.filesDirectory}/${id}.json`);
      const updatedAnimal: IAnimal = this.animalService.updateAnimal(animalFromFile, animal.name, animal.type);
      this.fileOperations.writeSingleFile(this.filesDirectory, updatedAnimal);
      return updatedAnimal;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('add')
  addOneAnimal(@Body() animal: AnimalDTO): IAnimal {
    try {
      if (!animal.name || !animal.type || animal.name.length < 1 || animal.type.length < 1) {
        throw new Error('You need to provide name and type of animal!');
      }
      if (!this.animalService.animalTypeValidation(animal.type)) {
        throw new Error(`Type ${animal.type} is not valid! Please use one of available types!`);
      }
      const animalToWrite: IAnimal = this.animalService.createAnimal(animal.name, animal.type);
      return this.fileOperations.writeSingleFile(this.filesDirectory, animalToWrite);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('add/animals')
  async addAllAnimals(@Body() animalsArray: AnimalDTO[]) {
    try {
      const resultArray: IAnimal[] = [];
      if (animalsArray.length < 1) {
        throw new Error('You need to provide proper animals array');
      }
      for (const animal of animalsArray) {
        if (!this.animalService.animalTypeValidation(animal.type)) {
          throw new Error(`Type ${animal.type} is not valid! Please use one of available types!`);
        }
      }
      for (const animal of animalsArray) {
        const animalToWrite: IAnimal = this.animalService.createAnimal(animal.name, animal.type);
        this.fileOperations.writeSingleFile(this.filesDirectory, animalToWrite);
        resultArray.push(animalToWrite);
      }
      return resultArray;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('add/:type')
  async addAnimalsWithType(@Param('type') type: string, @Body() arrayOfNames: { name: string }[]) {
    try {
      const resultArray: IAnimal[] = [];
      if (arrayOfNames.length < 1) {
        throw new Error('You need to provide proper names array!');
      }
      if (!this.animalService.animalTypeValidation(type)) {
        throw new Error(`Type ${type} is not valid! Please use one of available types!`);
      }
      for (const animal of arrayOfNames) {
        const animalToWrite: IAnimal = this.animalService.createAnimal(animal.name, type as EAnimalTypes);
        this.fileOperations.writeSingleFile(this.filesDirectory, animalToWrite);
        resultArray.push(animalToWrite);
      }
      return resultArray;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
