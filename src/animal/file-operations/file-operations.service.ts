import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { AnimalDTO } from './dtos/animal.dto';
import { FileOperationsException } from './exceptions/file-operations.exception';
import { IAnimal } from '../models/animal.interface';
import { AnimalService } from '../animal.service';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class FileOperationsService {
  constructor(private readonly animalService: AnimalService, private configService: ConfigService) {}
  private filesDirectory: string = this.configService.get<string>('FILES_DIRECTORY');

  public async readSingleFile(fileName: string): Promise<IAnimal> {
    try {
      if (fileName.length < 1) {
        throw new Error('You need to provide file name!');
      }
      const fileAdress: string = this.createAdress(fileName);
      const data: string = await fs.readFile(fileAdress, 'utf-8');
      const parsedData: IAnimal = JSON.parse(data);
      return parsedData;
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        throw new FileOperationsException(`Cannot find animal with id: ${fileName}`);
      }
      throw new FileOperationsException(err);
    }
  }

  public async readAllFiles(): Promise<Array<IAnimal>> {
    try {
      const result: IAnimal[] = [];
      const allFiles: string[] = await fs.readdir(this.filesDirectory);

      if (allFiles.length < 1) {
        throw new Error(`Given directory: ${this.filesDirectory} - is empty!`);
      }
      for (const singleFile of allFiles) {
        const fileName: string = singleFile.split('.')[0];
        const animal: IAnimal = await this.readSingleFile(fileName);
        result.push(animal);
      }
      return result;
    } catch (err: any) {
      throw new FileOperationsException(err);
    }
  }

  public async writeSingleFile(animal: IAnimal): Promise<IAnimal> {
    try {
      const fileToWrite: string = this.createAdress(animal.id);
      const dataToWrite: string = JSON.stringify(animal);
      await fs.writeFile(fileToWrite, dataToWrite, 'utf-8');
      return animal;
    } catch (err: any) {
      throw new FileOperationsException(err);
    }
  }

  public async writeAllFiles(dataArray: AnimalDTO[]): Promise<IAnimal[]> {
    try {
      const result: IAnimal[] = [];
      if (dataArray.length < 1) {
        throw new Error('dataArray cannot be empty!');
      }
      for (const singleAnimal of dataArray) {
        const animal: IAnimal = this.animalService.createAnimal(singleAnimal.name, singleAnimal.type);
        await this.writeSingleFile(animal);
        result.push(animal);
      }
      return result;
    } catch (err: any) {
      throw new FileOperationsException(err);
    }
  }

  private createAdress(fileName: string): string {
    const adress: string = `${this.filesDirectory}/${fileName}.json`;
    return adress;
  }
}
