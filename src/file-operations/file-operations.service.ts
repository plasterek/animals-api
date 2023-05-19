import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { AnimalDTO } from './dtos/animal.dto';
import { FileOperationsException } from './exceptions/file-operations.exception';
import { existsSync } from 'fs';
import { IAnimal } from '../animal/models/animal.interface';
import { AnimalService } from 'src/animal/animal.service';

@Injectable()
export class FileOperationsService {
  constructor(private readonly animalService: AnimalService) {}

  public async readSingleFile(fileAdress: string): Promise<IAnimal> {
    try {
      if (fileAdress.length < 1) {
        throw new Error('You need to provide adress to the file!');
      }
      if (!existsSync(fileAdress)) {
        throw new Error('File with given ID does not exist!');
      }
      const data: string = await this.readFilePromise(fileAdress);
      if (data.length < 1) {
        throw new Error('File is empty!');
      }
      try {
        const parsedData: IAnimal = JSON.parse(data);
        return parsedData;
      } catch (err: any) {
        throw new Error('Invalid JSON file!');
      }
    } catch (err: any) {
      throw new FileOperationsException(err);
    }
  }

  public async readAllFiles(directoryAdress: string): Promise<Array<IAnimal>> {
    try {
      if (directoryAdress.length < 1 || !existsSync(directoryAdress)) {
        throw new Error('Youd need to provide proper directory!');
      }
      const allFiles: string[] = await this.readFolderPromise(directoryAdress);
      if (allFiles.length < 1) {
        throw new Error(`Given directory: ${directoryAdress} - is empty!`);
      }
      const arrayOfPromises: Promise<IAnimal>[] = allFiles.map(async (singleFile: string) => {
        const filePath: string = `${directoryAdress}/${singleFile}`;
        const result: IAnimal = await this.readSingleFile(filePath);
        return result;
      });
      return Promise.all(arrayOfPromises);
    } catch (err: any) {
      throw new FileOperationsException(err);
    }
  }

  public writeSingleFile(fileDirectory: string, animal: IAnimal): IAnimal {
    try {
      if (fileDirectory.length < 1 || !existsSync(fileDirectory)) {
        throw new Error('You need to provide proper directory and file name!');
      }
      const fileToWrite: string = `${fileDirectory}/${animal.id}.json`;
      const dataToWrite: string = JSON.stringify(animal);

      fs.writeFile(fileToWrite, dataToWrite, 'utf-8', (err) => {
        if (err) {
          throw new Error('Failed to write to the file!');
        }
        console.log(`File ${animal.id}.json saved succesfully!`);
      });
      return animal;
    } catch (err: any) {
      throw new FileOperationsException(err);
    }
  }

  public async writeAllFiles(folderDirectory: string, dataArray: AnimalDTO[]): Promise<IAnimal[]> {
    try {
      if (folderDirectory.length < 1 || !existsSync(folderDirectory)) {
        throw new Error('Youd need to provide proper directory!');
      }
      if (dataArray.length < 1) {
        throw new Error('dataArray cannot be empty!');
      }
      const arrayOfPromises = dataArray.map((singleAnimal: AnimalDTO) => {
        const animal: IAnimal = this.animalService.createAnimal(singleAnimal.name, singleAnimal.type);
        return this.writeSingleFile(folderDirectory, animal);
      });
      const result: IAnimal[] = await Promise.all(arrayOfPromises);
      return result;
    } catch (err: any) {
      throw new FileOperationsException(err);
    }
  }

  private readFilePromise(fileDirectory: string): Promise<string> {
    return new Promise((res, rej) => {
      fs.readFile(fileDirectory, 'utf-8', (err, data) => {
        if (err) {
          rej(err.message);
        }
        res(data);
      });
    });
  }

  private readFolderPromise(folderDirectory: string): Promise<string[]> {
    return new Promise((res, rej) => {
      fs.readdir(folderDirectory, (err, files) => {
        if (err) {
          rej(err.message);
        }
        res(files);
      });
    });
  }
}
