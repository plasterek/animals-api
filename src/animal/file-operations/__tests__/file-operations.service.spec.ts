import { Test, TestingModule } from '@nestjs/testing';
import { FileOperationsService } from '../file-operations.service';
import { AnimalService } from '../../animal.service';
import { ConfigService } from '@nestjs/config';
import * as mockFS from 'mock-fs';
import * as fs from 'fs/promises';
import { IAnimal } from '../../models/animal.interface';
import { EAnimalTypes } from '../enums/animal-types.enum';
import { AnimalDTO } from '../dtos/animal.dto';

describe('FileOperationsService', () => {
  let service: FileOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileOperationsService, AnimalService, ConfigService],
      imports: [],
    }).compile();
    service = module.get<FileOperationsService>(FileOperationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When trying to read single file and file name is empty string', () => {
    it('It should throw an exception', () => {
      //given
      const fileName: string = '';
      //then
      expect(async () => await service.readSingleFile(fileName)).rejects.toThrow();
    });
  });

  describe('When trying to read single file and file connot be found', () => {
    it('It should throw an exception', () => {
      //given
      const fileName: string = 'fileName';
      //when
      jest.spyOn(fs, 'readFile').mockRejectedValue(new Error());
      //then
      expect(async () => await service.readSingleFile(fileName)).rejects.toThrow();
    });
  });

  describe('When trying to read single file and it is not proper JSON file', () => {
    it('It should throw an exception', () => {
      //given
      const fileName: string = 'fileName';
      //when
      jest.spyOn(fs, 'readFile').mockImplementation(() => Promise.resolve(''));
      //then
      expect(async () => await service.readSingleFile(fileName)).rejects.toThrow();
    });
  });

  describe('When trying to read single file and everything goes well', () => {
    it('It should return IAnimal object', async () => {
      //given
      const mockReturn: string = '{}';
      const fileName: string = 'fileName';
      //when
      jest.spyOn(fs, 'readFile').mockImplementation(() => Promise.resolve(mockReturn));
      //then
      expect(await service.readSingleFile(fileName)).toMatchObject({});
    });
  });

  describe('When trying to read all files and the given folder is empty', () => {
    it('It should throw an exception', () => {
      //given
      const folder: [] = [];
      //when
      jest.spyOn(fs, 'readdir').mockResolvedValue(folder);
      //then
      expect(async () => await service.readAllFiles()).rejects.toThrow();
    });
  });

  describe('When trying to read all files and path to folder is incorrect', () => {
    it('It should throw an exception', () => {
      //when
      jest.spyOn(fs, 'readdir').mockRejectedValue(new Error());
      //then
      expect(async () => await service.readAllFiles()).rejects.toThrow();
    });
  });

  describe('When trying to read all files and everything goes well', () => {
    it('It should return IAnimal Array', async () => {
      //given
      const animal: IAnimal = new IAnimal('name', EAnimalTypes.FISH, 'id');
      mockFS({ animals: { 'id.json': JSON.stringify(animal) } });
      //when
      const result: IAnimal[] = await service.readAllFiles();
      //then
      expect(result).toMatchObject([animal]);
      mockFS.restore();
    });
  });

  describe('When trying to write single file and everything goes well', () => {
    it('It should not throw exception', () => {
      //given
      const animal: IAnimal = new IAnimal('name', EAnimalTypes.FISH, 'id');
      //when
      jest.spyOn(fs, 'writeFile').mockImplementation();
      expect(async () => await service.writeSingleFile(animal)).not.toThrow();
    });
  });

  describe('When trying to write many files and given array is empty', () => {
    it('It should throw an exception', () => {
      //given
      const animalsArray: AnimalDTO[] = [];
      //then
      expect(async () => {
        await service.writeAllFiles(animalsArray);
      }).rejects.toThrow();
    });
  });

  describe('When trying to write many files and everything goes well', () => {
    it('It should return IAnimal arary', () => {
      //given
      const animalDTO: AnimalDTO = { name: 'name', type: EAnimalTypes.FISH };
      const animalsArray: AnimalDTO[] = [animalDTO];
      //then
      expect(async () => {
        await service.writeAllFiles(animalsArray);
      }).resolves.toMatchObject<IAnimal[]>;
    });
  });
});
